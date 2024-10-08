<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = "usuarios";

    protected $fillable = [
        "usuario",
        "password",
        "superadmin",
    ];
    
    protected $hidden = ["password"];

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_usuario');
    }
}
