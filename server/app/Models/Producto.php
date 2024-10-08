<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        "codigo",
        "descripcion",
        "detalle",
        "stock_cbba",
        "stock_sc",
        "foto",
        "porcentaje",
        "precio_cbba",
        "precio_oferta_cbba",
        "precio_sc",
        "precio_oferta_sc",
        "piezas",
        "id_tienda",
        "total_ventas_cbba",
        "total_ventas_sc"
    ];

    public function tienda()
    {
        return $this->belongsTo(Tienda::class, 'id_tienda');
    }

    public function categorias()
    {
        return $this->hasManyThrough(
            Categoria::class, 
            ProductoCategoria::class,
            'id_producto',
            'id',
            'id',
            'id_categoria'
        );
    }

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_producto');
    }
}
