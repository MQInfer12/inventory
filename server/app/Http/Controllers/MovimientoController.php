<?php

namespace App\Http\Controllers;

use App\Models\Movimiento;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MovimientoController extends Controller
{
    public function index(Request $request)
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

        $query = Movimiento::with('producto')->orderBy('fecha', 'desc');
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

        $movimientos = $query->get();
        return response()->json([
            "status" => 200,
            "message" => "Movimientos obtenidos correctamente",
            "data" => $movimientos
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
            $movimiento->cantidad_sc = $diff_sc;
            $movimiento->fecha = $currentDateTime;

            $producto->stock_cbba += $movimiento->cantidad_cbba;
            $producto->stock_sc += $movimiento->cantidad_sc;

            $producto->save();
            $movimiento->save();

            $productos[] = $producto;
        }
        return response()->json([
            "status" => 200,
            "message" => "Movimiento guardado correctamente",
            "data" => $productos
        ]);
    }
}
