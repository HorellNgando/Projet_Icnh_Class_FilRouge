<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemoignagesTable extends Migration
{
    public function up()
    {
        Schema::create('temoignages', function (Blueprint $table) {
            $table->id('id_temoignage');
            $table->unsignedBigInteger('id_utilisateur');
            $table->text('message');
            $table->integer('etoiles')->between(1, 5);
            $table->string('photo')->nullable();
            $table->timestamps();

            $table->foreign('id_utilisateur')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
            $table->unique('id_utilisateur'); // Un seul témoignage par utilisateur
        });
    }

    public function down()
    {
        Schema::dropIfExists('temoignages');
    }
}