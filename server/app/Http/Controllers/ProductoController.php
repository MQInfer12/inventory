<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Producto::all();
        return response()->json([
            "message" => "Productos obtenidos correctamente",
            "status" => 200,
            "data" => $productos
        ]);
    }

    public function store(Request $request)
    {
        
    }

    public function show(Producto $producto)
    {

    }

    public function update(Request $request, Producto $producto)
    {

    }

    public function destroy(Producto $producto)
    {
        
    }
}
