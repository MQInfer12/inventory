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

    public function storeMany(Request $request)
    {
        $categories = $request->categories;

        if (!$categories || !is_array($categories)) {
            return response()->json([
                "status" => 400,
                "message" => "Se requiere un array de categorías",
                "data" => null
            ]);
        }

        $response = [];
        foreach($categories as $categorie) 
        {
            if (!$categorie) {
                return response()->json([
                    "status" => 500,
                    "message" => "La categoría es requerida",
                    "data" => null
                ]);
            }
            
            $categoria = new Categoria();
            $categoria->descripcion = $categorie;
            $categoria->save();
            $response[] = $categoria;
        }

        return response()->json([
            "status" => 200,
            "message" => "Categoría creada exitosamente",
            "data" => $response
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
