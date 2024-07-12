<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $fillable = [
        "descripcion"
    ];

    public function productos()
    {
        return $this->hasManyThrough(
            Producto::class, 
            ProductoCategoria::class,
            'id_categoria',
            'id',
            'id',
            'id_producto'
        );
    }
}
