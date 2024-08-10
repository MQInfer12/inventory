<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\FormularioController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\ProductoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RespuestaController;
use App\Http\Controllers\TiendaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => ["auth:sanctum"]], function () {
    Route::get('/me', [UsuarioController::class, 'perfil']);
    Route::get('/logout', [UsuarioController::class, 'logout']);
    Route::post('/profile', [UsuarioController::class, 'actualizarFirma']);

    Route::post('/registro', [UsuarioController::class, 'registro']);
    Route::get('/usuario', [UsuarioController::class, 'index']);
    Route::patch('/password/{id}', [UsuarioController::class, 'password']);
    Route::delete('/usuario/{id}', [UsuarioController::class, 'destroy']);
    Route::put('/usuario/{id}', [UsuarioController::class, 'update']);
    Route::get('/usuario/{id}', [UsuarioController::class, 'show']);

    Route::apiResource('/producto', ProductoController::class);
    Route::apiResource('/categoria', CategoriaController::class);
    Route::apiResource('/tienda', TiendaController::class);

    Route::get('/movimiento', [MovimientoController::class, 'index']);
    Route::post('/movimiento', [MovimientoController::class, 'store']);
    Route::get('/movimiento/{idProduct}', [MovimientoController::class, 'show']);

    Route::post('/seeds/categoria', [CategoriaController::class, 'storeMany']);
    Route::post('/seeds/tienda', [TiendaController::class, 'storeMany']);
    Route::post('/seeds/producto', [ProductoController::class, 'storeMany']);
});

Route::get('/', [UsuarioController::class, 'index_route']);
Route::post('/login', [UsuarioController::class, 'login']);