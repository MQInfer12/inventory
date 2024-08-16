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
        Schema::table('movimientos', function (Blueprint $table) {
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->cascadeOnUpdate()->nullOnDelete();
            $table->integer('actual_cbba')->default(0);
            $table->integer('actual_sc')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('movimientos', function (Blueprint $table) {
            $table->dropForeign(['id_usuario']);
            $table->dropColumn('id_usuario');
            $table->dropColumn('actual_cbba');
            $table->dropColumn('actual_sc');
        });
    }
};
