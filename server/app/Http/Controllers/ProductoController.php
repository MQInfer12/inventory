<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{

    public function index()
    {
        return response()->json([
            "status" => 200,
            "message" => "Productos obtenidos exitosamente",
            "data" => Producto::with('tienda')->get()
        ]);
    }

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
        return $val ? doubleval($val) : null;
    }
    private function to_double_or_null($val) 
    {
        $val = str_replace(',', '.', $val);
        return $val ? doubleval($val) : null;
    }
    
    public function store(Request $request)
    {
        $error = "";
        if(!$request->codigo) $error = "El código es obligatorio";
        if(!$request->descripcion) $error = "La descripción es obligatoria";
        if(!$request->stock_cbba) $error = "Ambos stocks son obligatorios";
        if(!$request->stock_sc) $error = "Ambos stocks son obligatorios";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $producto = new Producto();
        $producto->codigo = $request->codigo;
        $producto->descripcion = $request->descripcion;
        $producto->detalle = $request->detalle;

        $producto->stock_cbba = intval($request->stock_cbba);
        $producto->stock_sc = intval($request->stock_sc);

        $producto->porcentaje = $this->to_double_or_null($request->porcentaje);
        $producto->piezas = $this->to_double_or_null($request->piezas);

        $producto->precio_cbba = $this->to_double_or_null($request->precio_cbba);
        $producto->precio_oferta_cbba = $this->to_double_or_null($request->precio_oferta_cbba);
        $producto->precio_sc = $this->to_double_or_null($request->precio_sc);
        $producto->precio_oferta_sc = $this->to_double_or_null($request->precio_oferta_sc);

        $producto->id_tienda = $this->to_int_or_null($request->id_tienda);

        if ($request->file("foto") != null) {
            $filename = $this->generateRandomString();
            $request->file("foto")->storeAs("/public", $filename . ".jpg");
            $producto->foto = $filename . ".jpg";
        }

        $producto->save();

        $producto->load('tienda');

        return response()->json([
            "status" => 200,
            "message" => "Producto creado exitosamente",
            "data" => $producto
        ]);
    }

    public function show(int $id)
    {
        $tienda = Producto::with('tienda')->where('id', $id)->first();

        if(!$tienda) return response()->json([
            "status" => 404,
            "message" => "Producto no encontrado",
            "data" => null
        ]);

        return response()->json([
            "status" => 200,
            "message" => "Producto obtenido exitosamente",
            "data" => $tienda
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
        if(!$request->stock_cbba) $error = "Ambos stocks son obligatorios";
        if(!$request->stock_sc) $error = "Ambos stocks son obligatorios";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
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

        $producto->precio_cbba = $this->to_double_or_null($request->precio_cbba);
        $producto->precio_oferta_cbba = $this->to_double_or_null($request->precio_oferta_cbba);
        $producto->precio_sc = $this->to_double_or_null($request->precio_sc);
        $producto->precio_oferta_sc = $this->to_double_or_null($request->precio_oferta_sc);

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
        
        $producto->load('tienda');

        return response()->json([
            "status" => 200,
            "message" => "Tienda actualizado exitosamente",
            "data" => $producto
        ]);
    }

    public function destroy(int $id)
    {
        $producto = Producto::destroy($id);
        return response()->json([
            "status" => $producto > 0 ? 200 : 404,
            "message" => $producto > 0 ? "Producto eliminada exitosamente" : "Error al eliminar el producto",
            "data" => $id
        ]);
    }
}
