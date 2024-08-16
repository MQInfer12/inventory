<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get("/", function () {
    return view('index');
});

/* Route::get('/foo', function () {
    Artisan::call("storage:link");
    return "foo";
}); */

/* Route::get('/a', function () {
    $res = Artisan::call("migrate:reset");
    return $res;
});

Route::get('/b', function () {
    $res = Artisan::call("migrate");
    return $res;
});

Route::get('/c', function () {
    $res = Artisan::call("db:seed");
    return $res;
}); */