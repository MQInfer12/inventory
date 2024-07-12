<?php

use App\Http\Controllers\FormularioController;
use App\Http\Controllers\ProductoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RespuestaController;
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
});

Route::post('/login', [UsuarioController::class, 'login']);