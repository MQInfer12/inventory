<?php

namespace App\Http\Controllers;

use App\Models\Movimiento;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MovimientoController extends Controller
{
    private function to_double_or_null($val) 
    {
        $val = str_replace(',', '.', $val);
        return $val != null ? doubleval($val) : null;
    }

    public function index(Request $request, $productId = null)
    {
        $fechaInicio = $request->query('fechaInicio');
        $fechaFinal = $request->query('fechaFinal');
        $categorias = $request->query('categories');

        $fechaInicioCarbon = null;
        $fechaFinalCarbon = null;

        if($fechaInicio) {
            $fechaInicioCarbon = Carbon::parse($fechaInicio)->startOfDay();
        }
        if($fechaFinal) {
            $fechaFinalCarbon = Carbon::parse($fechaFinal)->endOfDay();
        }

        if ($fechaInicioCarbon && $fechaFinalCarbon) {
            if ($fechaInicioCarbon->gt($fechaFinalCarbon)) {
                return response()->json([
                    "status" => 500,
                    "message" => "La fecha de inicio no puede ser mayor que la fecha final",
                    "data" => []
                ]);
            }
            if ($fechaFinalCarbon->lt($fechaInicioCarbon)) {
                return response()->json([
                    "status" => 500,
                    "message" => "La fecha final no puede ser menor que la fecha de inicio",
                    "data" => []
                ]);
            }
        }

        $query = Movimiento::with('producto')->with('producto.categorias')->with('usuario')->orderBy('fecha', 'desc');
        if ($fechaInicioCarbon) {
            $query->where('fecha', '>=', $fechaInicioCarbon);
        }
        if ($fechaFinalCarbon) {
            $query->where('fecha', '<=', $fechaFinalCarbon);
        }

        if ($categorias) {
            $categorias = json_decode($categorias, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    "status" => 500,
                    "message" => "Formato de categorías inválido",
                    "data" => null
                ]);
            }
            $query->whereHas('producto.categorias', function ($q) use ($categorias) {
                $q->whereIn('id_categoria', $categorias);
            });
        }

        if ($productId) {
            $query->where('id_producto', $productId);
        }

        $movimientos = $query->get();
        return response()->json([
            "status" => 200,
            "message" => "Movimientos obtenidos correctamente",
            "data" => $movimientos
        ]);
    }

    public function show(Request $request, int $idProduct)
    {
        $producto = Producto::with('tienda')->with('categorias')->where('id', $idProduct)->first();

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

        $indexResponse = $this->index($request, $idProduct);

        $indexData = $indexResponse->getData();
        if ($indexData->status != 200) {
            return response()->json([
                "status" => $indexData->status,
                "message" => $indexData->message,
                "data" => null
            ]);
        }

        return response()->json([
            "status" => 200,
            "message" => "Producto y movimientos obtenidos correctamente",
            "data" => [
                "producto" => $producto,
                "movimientos" => $indexData->data
            ]
        ]);
    }

    /**
     * request is 
     * {
     *    data: {
     *       id: number;
     *       diff_cbba: number;
     *       diff_sc: number;
     *    }[]
     * }
    */
    public function store(Request $request)
    {
        $user = auth()->user();
        $currentDateTime = now()->subHours(4);
        $productos = [];
        foreach ($request->data as $transaction) {
            $id_producto = $transaction['id'];
            $diff_cbba = $transaction['diff_cbba'];
            $diff_sc = $transaction['diff_sc'];

            $producto = Producto::with('tienda')->where('id', $id_producto)->first();
            if(!$producto) {
                return response()->json([
                    "status" => 500,
                    "message" => "No se pudo encontrar un producto",
                    "data" => Movimiento::orderBy('id', 'asc')->get()
                ]);
            }

            $movimiento = new Movimiento();
            $movimiento->id_producto = $id_producto;
            $movimiento->cantidad_cbba = $diff_cbba;
            if($diff_cbba < 0) {
                $producto->total_ventas_cbba += ($diff_cbba * -1);
            }
            $movimiento->actual_cbba = $producto->stock_cbba + $diff_cbba;
            $movimiento->cantidad_sc = $diff_sc;
            if($diff_sc < 0) {
                $producto->total_ventas_sc += ($diff_sc * -1);
            }
            $movimiento->actual_sc = $producto->stock_sc + $diff_sc;
            $movimiento->fecha = $currentDateTime;
            $movimiento->id_usuario = $user->id;

            $producto->stock_cbba += $movimiento->cantidad_cbba;
            $producto->stock_sc += $movimiento->cantidad_sc;

            $producto->save();
            $movimiento->save();
            $producto->movimiento = $movimiento;

            $productos[] = $producto;
        }
        return response()->json([
            "status" => 200,
            "message" => "Movimiento guardado correctamente",
            "data" => $productos
        ]);
    }
}
