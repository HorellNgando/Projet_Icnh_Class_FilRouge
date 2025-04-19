<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientsTable extends Migration
{
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id('id_patient');
            $table->unsignedBigInteger('id_utilisateur');
            $table->date('date_de_naissance')->nullable();
            $table->string('sexe')->nullable();
            $table->string('groupe_sanguin')->nullable();
            $table->timestamps();

            $table->foreign('id_utilisateur')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('patients');
    }
}