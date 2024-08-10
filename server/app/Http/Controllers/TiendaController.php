<?php

namespace App\Http\Controllers;

use App\Models\Tienda;
use Illuminate\Http\Request;

class TiendaController extends Controller
{
    public function index()
    {
        return response()->json([
            "status" => 200,
            "message" => "Tiendas obtenidas exitosamente",
            "data" => Tienda::orderBy('id', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $error = "";
        if(!$request->nombre) $error = "El nombre es obligatorio";
        if(!$request->ciudad) $error = "La ciudad es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $tienda = new Tienda();
        $tienda->nombre = $request->nombre;
        $tienda->descripcion = $request->descripcion;
        $tienda->ciudad = $request->ciudad;
        $tienda->save();

        return response()->json([
            "status" => 200,
            "message" => "Tienda creada exitosamente",
            "data" => $tienda
        ]);
    }

    public function storeMany(Request $request)
    {
        $tiendas = $request->tiendas;

        if (!$tiendas || !is_array($tiendas)) {
            return response()->json([
                "status" => 400,
                "message" => "Se requiere un array de tiendas",
                "data" => null
            ]);
        }

        $response = [];
        foreach($tiendas as $t) 
        {
            if (!$t) {
                return response()->json([
                    "status" => 500,
                    "message" => "La tienda es requerida",
                    "data" => null
                ]);
            }
            
            $tienda = new Tienda();
            $tienda->nombre = $t;
            $tienda->ciudad = "Santa Cruz";
            $tienda->save();
            $response[] = $tienda;
        }

        return response()->json([
            "status" => 200,
            "message" => "Tiendas creadas exitosamente",
            "data" => $response
        ]);
    }

    public function show(int $id)
    {
        $tienda = Tienda::where('id', $id)->first();

        if(!$tienda) return response()->json([
            "status" => 404,
            "message" => "Tienda no encontrada",
            "data" => null
        ]);

        return response()->json([
            "status" => 200,
            "message" => "Tienda obtenida exitosamente",
            "data" => $tienda
        ]);
    }

    public function update(Request $request, int $id)
    {
        $tienda = Tienda::where('id', $id)->first();
        if(!$tienda) return response()->json([
            "status" => 404,
            "message" => "Tienda no encontrada",
            "data" => null
        ]);
        
        $error = "";
        if(!$request->nombre) $error = "El nombre es obligatorio";
        if(!$request->ciudad) $error = "La ciudad es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $tienda->nombre = $request->nombre;
        $tienda->descripcion = $request->descripcion;
        $tienda->ciudad = $request->ciudad;
        $tienda->save();

        return response()->json([
            "status" => 200,
            "message" => "Tienda actualizada exitosamente",
            "data" => $tienda
        ]);
    }

    public function destroy(int $id)
    {
        $tienda = Tienda::destroy($id);
        return response()->json([
            "status" => $tienda > 0 ? 200 : 404,
            "message" => $tienda > 0 ? "Tienda eliminada exitosamente" : "Error al eliminar la tienda",
            "data" => $id
        ]);
    }
}
