<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json([
            "status" => 200,
            "message" => "Categorías obtenidas exitosamente",
            "data" => Categoria::orderBy('id', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $error = "";
        if(!$request->descripcion) $error = "La descripción es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $categoria = new Categoria();
        $categoria->descripcion = $request->descripcion;
        $categoria->save();

        return response()->json([
            "status" => 200,
            "message" => "Categoría creada exitosamente",
            "data" => $categoria
        ]);
    }

    public function show(int $id)
    {
        $categoria = Categoria::where('id', $id)->first();

        if(!$categoria) return response()->json([
            "status" => 404,
            "message" => "Categoría no encontrada",
            "data" => null
        ]);

        return response()->json([
            "status" => 200,
            "message" => "Categoría creada exitosamente",
            "data" => $categoria
        ]);
    }

    public function update(Request $request, int $id)
    {
        $categoria = Categoria::where('id', $id)->first();
        if(!$categoria) return response()->json([
            "status" => 404,
            "message" => "Categoría no encontrada",
            "data" => null
        ]);
        
        $error = "";
        if(!$request->descripcion) $error = "La descripción es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $categoria->descripcion = $request->descripcion;
        $categoria->save();

        return response()->json([
            "status" => 200,
            "message" => "Categoría actualizada exitosamente",
            "data" => $categoria
        ]);
    }

    public function destroy(int $id)
    {
        $categoria = Categoria::destroy($id);
        return response()->json([
            "status" => $categoria > 0 ? 200 : 404,
            "message" => $categoria > 0 ? "Categoría eliminada exitosamente" : "Error al eliminar la categoría",
            "data" => $id
        ]);
    }
}
