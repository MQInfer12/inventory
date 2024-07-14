<?php

namespace App\Http\Controllers;

use App\Models\Movimiento;
use App\Models\Producto;
use Illuminate\Http\Request;

class MovimientoController extends Controller
{
    public function index()
    {
        return response()->json([
            "status" => 200,
            "message" => "Movimientos obtenidos correctamente",
            "data" => Movimiento::orderBy('id', 'asc')->get()
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
        $currentDateTime = now();
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
