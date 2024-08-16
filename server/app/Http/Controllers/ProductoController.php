<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Movimiento;
use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\Tienda;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    private function generateRandomString($length = 24)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    private function to_int_or_null($val) 
    {
        return $val != null ? intval($val) : null;
    }
    private function to_double_or_null($val) 
    {
        $val = str_replace(',', '.', $val);
        return $val != null ? doubleval($val) : null;
    }

    public function index()
    {
        $productos = Producto::orderBy('id', 'asc')
            ->with(['tienda', 'categorias'])
            ->get();

        foreach ($productos as $producto) {
            $producto->porcentaje = $this->to_double_or_null($producto->porcentaje);
            $producto->piezas = $this->to_double_or_null($producto->piezas);
            $producto->precio_cbba = $this->to_double_or_null($producto->precio_cbba);
            $producto->precio_oferta_cbba = $this->to_double_or_null($producto->precio_oferta_cbba);
            $producto->precio_sc = $this->to_double_or_null($producto->precio_sc);
            $producto->precio_oferta_sc = $this->to_double_or_null($producto->precio_oferta_sc);
            // Aquí quiero el último movimiento
            $producto->movimiento = $producto->movimientos()->orderBy('fecha', 'desc')->first();
        }

        return response()->json([
            "status" => 200,
            "message" => "Productos obtenidos exitosamente",
            "data" => $productos
        ]);
    }
    
    public function store(Request $request)
    {
        $error = "";
        if(!$request->codigo) $error = "El código es obligatorio";
        if(!$request->descripcion) $error = "La descripción es obligatoria";
        if($request->stock_cbba == null) $error = "Ambos stocks son obligatorios";
        if($request->stock_sc == null) $error = "Ambos stocks son obligatorios";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $producto = new Producto();

        $existCodigo = Producto::where('codigo', $request->codigo)->first();
        if($existCodigo) {
            return response()->json([
                "status" => 500,
                "message" => "Ya existe un producto con este código",
                "data" => null
            ]);
        }

        $producto->codigo = $request->codigo;
        $producto->descripcion = $request->descripcion;
        $producto->detalle = $request->detalle;

        $producto->stock_cbba = intval($request->stock_cbba);
        $producto->stock_sc = intval($request->stock_sc);

        $producto->porcentaje = $this->to_double_or_null($request->porcentaje);
        $producto->piezas = $this->to_double_or_null($request->piezas);

        $precio_cbba = $this->to_double_or_null($request->precio_cbba);
        $precio_oferta_cbba = $this->to_double_or_null($request->precio_oferta_cbba);
        $precio_sc = $this->to_double_or_null($request->precio_sc);
        $precio_oferta_sc = $this->to_double_or_null($request->precio_oferta_sc);

        $error = "";
        if($precio_cbba != null && $precio_cbba < 0) $error = "Los precios tienen que ser valores positivos";
        if($precio_oferta_cbba != null && $precio_oferta_cbba < 0) $error = "Los precios tienen que ser valores positivos";
        if($precio_sc != null && $precio_sc < 0) $error = "Los precios tienen que ser valores positivos";
        if($precio_oferta_sc != null && $precio_oferta_sc < 0) $error = "Los precios tienen que ser valores positivos";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $producto->precio_cbba = $precio_cbba;
        $producto->precio_oferta_cbba = $precio_oferta_cbba;
        $producto->precio_sc = $precio_sc;
        $producto->precio_oferta_sc = $precio_oferta_sc;

        $producto->id_tienda = $this->to_int_or_null($request->id_tienda);

        if ($request->file("foto") != null) {
            $filename = $this->generateRandomString();
            $request->file("foto")->storeAs("/public", $filename . ".jpg");
            $producto->foto = $filename . ".jpg";
        }

        $producto->save();

        $categorias = json_decode($request->categorias, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                "status" => 500,
                "message" => "Formato de categorías inválido",
                "data" => null
            ]);
        }
        foreach($categorias as $idCategoria){
            $producto_categoria = new ProductoCategoria();
            $producto_categoria->id_producto = $producto->id;
            $producto_categoria->id_categoria = $idCategoria;
            $producto_categoria->save();
        }

        $user = auth()->user();

        $movimiento = new Movimiento();
        $movimiento->id_producto = $producto->id;
        $movimiento->id_usuario = $user->id;
        $movimiento->cantidad_cbba = 0;
        $movimiento->cantidad_sc = 0;
        $movimiento->actual_cbba = intval($request->stock_cbba);
        $movimiento->actual_sc = intval($request->stock_sc);
        $movimiento->fecha = now()->subHours(4);
        $movimiento->save();

        $producto->load('tienda');
        $producto->load('categorias');
        $producto->movimiento = $movimiento;

        return response()->json([
            "status" => 200,
            "message" => "Producto creado exitosamente",
            "data" => $producto
        ]);
    }

    public function storeMany(Request $request)
    {
        $productos = $request->productos;

        if (!$productos || !is_array($productos)) {
            return response()->json([
                "status" => 400,
                "message" => "Se requiere un array de productos",
                "data" => null
            ]);
        }

        $fechaHora = now()->subHours(4);
        $fecha = Carbon::parse($fechaHora)->startOfDay();

        $noCodeCount = 0;

        $response = [];
        foreach($productos as $p) 
        {
            $producto = new Producto();

            //CARGAR LOS CODIGOS NULLS DESPUÉS
            $codigo = $p['CODIGO'];
            if($codigo) {
                $producto->codigo = $codigo;
            } else {
                $producto->codigo = "_".$noCodeCount;
                $noCodeCount = $noCodeCount + 1;
            }

            $producto->descripcion = $p['DESCRIPCION'];
            $producto->detalle = $p['DETALLE'];
            $producto->foto = null;
            $producto->porcentaje = $p['%'];
            $producto->piezas = $p['PIEZAS'];

            //TODO: PRECIOS ESTÁ DESORDENADO
            $producto->precio_cbba = $p['PRECIO'];
            $producto->precio_oferta_cbba = $p['PRECIO OFERTA'];
            $producto->precio_sc = $p['PRECIO'];
            $producto->precio_oferta_sc = $p['PRECIO OFERTA'];

            $saldo = $p['SALDO'];
            $producto->stock_cbba = 0;
            $producto->stock_sc = 0;

            $producto->id_tienda = null;
            $tienda = $p['TIENDA'];
            if($tienda) 
            {
                $t = Tienda::where('nombre', $tienda)->first();
                if ($t == null) {
                    $t = new Tienda();
                    $t->nombre = $tienda;
                    $t->descripcion = null;
                    $t->ciudad = "Santa Cruz";
                    $t->save();
                }
                $producto->id_tienda = $t->id;
            }
            
            $producto->save();

            $categoria = $p['CATEGORIA'];
            if($categoria) 
            {
                $c = Categoria::where('descripcion', $categoria)->first();
                if($c == null) {
                    $c = new Categoria();
                    $c->descripcion = $categoria;
                    $c->save();
                }
                $rel = new ProductoCategoria();
                $rel->id_producto = $producto->id;
                $rel->id_categoria = $c->id;
                $rel->save();
            }

            $movimiento = new Movimiento();
            $movimiento->id_producto = $producto->id;
            $movimiento->id_usuario = 1;
            $movimiento->cantidad_cbba = 0;
            $movimiento->cantidad_sc = 0;
            $movimiento->actual_cbba = 0;
            $movimiento->actual_sc = $producto->stock_sc;
            $movimiento->fecha = $fecha;
            $movimiento->save();

            $response[] = $producto;
        }

        return response()->json([
            "status" => 200,
            "message" => "Productos creados exitosamente",
            "data" => $response
        ]);
    }

    public function show(int $id)
    {
        $producto = Producto::with('tienda')->with('categorias')->where('id', $id)->first();

        if(!$producto) return response()->json([
            "status" => 404,
            "message" => "Producto no encontrado",
            "data" => null
        ]);

        $producto->porcentaje = $this->to_double_or_null($producto->porcentaje);
        $producto->piezas = $this->to_double_or_null($producto->piezas);
        $producto->precio_cbba = $this->to_double_or_null($producto->precio_cbba);
        $producto->precio_oferta_cbba = $this->to_double_or_null($producto->precio_oferta_cbba);
        $producto->precio_sc = $this->to_double_or_null($producto->precio_sc);
        $producto->precio_oferta_sc = $this->to_double_or_null($producto->precio_oferta_sc);
        $producto->movimiento = $producto->movimientos()->orderBy('fecha', 'desc')->first();
      
        return response()->json([
            "status" => 200,
            "message" => "Producto obtenidos exitosamente",
            "data" => $producto
        ]);
    }

    public function update(int $id, Request $request)
    {
        $producto = Producto::where('id', $id)->first();
        if(!$producto) return response()->json([
            "status" => 404,
            "message" => "Producto no encontrado",
            "data" => null
        ]);

        $error = "";
        if(!$request->codigo) $error = "El código es obligatorio";
        if(!$request->descripcion) $error = "La descripción es obligatoria";
        if($request->stock_cbba == null) $error = "Ambos stocks son obligatorios";
        if($request->stock_sc == null) $error = "Ambos stocks son obligatorios";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $existCodigo = Producto::where('codigo', $request->codigo)->where('id', "!=", $id)->first();
        if($existCodigo) {
            return response()->json([
                "status" => 500,
                "message" => "Ya existe un producto con este código",
                "data" => null
            ]);
        }

        $producto->codigo = $request->codigo;
        $producto->descripcion = $request->descripcion;
        $producto->detalle = $request->detalle;

        $producto->stock_cbba = intval($request->stock_cbba);
        $producto->stock_sc = intval($request->stock_sc);

        $producto->porcentaje = $this->to_double_or_null($request->porcentaje);
        $producto->piezas = $this->to_double_or_null($request->piezas);

        $precio_cbba = $this->to_double_or_null($request->precio_cbba);
        $precio_oferta_cbba = $this->to_double_or_null($request->precio_oferta_cbba);
        $precio_sc = $this->to_double_or_null($request->precio_sc);
        $precio_oferta_sc = $this->to_double_or_null($request->precio_oferta_sc);

        $error = "";
        if($precio_cbba != null && $precio_cbba < 0) $error = "Los precios tienen que ser valores positivos";
        if($precio_oferta_cbba != null && $precio_oferta_cbba < 0) $error = "Los precios tienen que ser valores positivos";
        if($precio_sc != null && $precio_sc < 0) $error = "Los precios tienen que ser valores positivos";
        if($precio_oferta_sc != null && $precio_oferta_sc < 0) $error = "Los precios tienen que ser valores positivos";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $producto->precio_cbba = $precio_cbba;
        $producto->precio_oferta_cbba = $precio_oferta_cbba;
        $producto->precio_sc = $precio_sc;
        $producto->precio_oferta_sc = $precio_oferta_sc;

        $producto->id_tienda = $this->to_int_or_null($request->id_tienda);

        if ($request->file("foto") != null) {
            if ($producto->foto) {
                Storage::delete('public/' . $producto->foto);
            }
            $filename = $this->generateRandomString();
            $request->file("foto")->storeAs("/public", $filename . ".jpg");
            $producto->foto = $filename . ".jpg";
        }

        $producto->save();

        $categorias = json_decode($request->categorias, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                "status" => 500,
                "message" => "Formato de categorías inválido",
                "data" => null
            ]);
        }
        $categoriasActuales = $producto->categorias->pluck('id')->toArray();
        $categoriasParaAñadir = array_diff($categorias, $categoriasActuales);
        $categoriasParaEliminar = array_diff($categoriasActuales, $categorias);
        foreach ($categoriasParaAñadir as $idCategoria) {
            $producto_categoria = new ProductoCategoria();
            $producto_categoria->id_producto = $producto->id;
            $producto_categoria->id_categoria = $idCategoria;
            $producto_categoria->save();
        }
        ProductoCategoria::where('id_producto', $producto->id)
            ->whereIn('id_categoria', $categoriasParaEliminar)
            ->delete();

        $producto->load('tienda');
        $producto->load('categorias');
        $producto->movimiento = $producto->movimientos()->orderBy('fecha', 'desc')->first();

        return response()->json([
            "status" => 200,
            "message" => "Tienda actualizado exitosamente",
            "data" => $producto
        ]);
    }

    public function destroy(int $id)
    {
        $producto = Producto::where('id', $id)->first();
        if(!$producto) return response()->json([
            "status" => 404,
            "message" => "Producto no encontrado",
            "data" => null
        ]);
        if ($producto->foto) {
            Storage::delete('public/' . $producto->foto);
        }
        $producto = Producto::destroy($id);
        return response()->json([
            "status" => $producto > 0 ? 200 : 404,
            "message" => $producto > 0 ? "Producto eliminado exitosamente" : "Error al eliminar el producto",
            "data" => $id
        ]);
    }
}
