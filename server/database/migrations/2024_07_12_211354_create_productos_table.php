<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string("codigo");
            $table->string("descripcion");
            $table->string("detalle")->nullable();
            $table->integer("stock_cbba");
            $table->integer("stock_sc");
            $table->string("foto")->nullable();
            $table->double("porcentaje")->nullable();
            $table->double("precio_cbba")->nullable();
            $table->double("precio_oferta_cbba")->nullable();
            $table->double("precio_sc")->nullable();
            $table->double("precio_oferta_sc")->nullable();
            $table->integer("piezas")->nullable();
            $table->foreignId("id_tienda")->nullable()->constrained('tiendas')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('productos');
    }
};
