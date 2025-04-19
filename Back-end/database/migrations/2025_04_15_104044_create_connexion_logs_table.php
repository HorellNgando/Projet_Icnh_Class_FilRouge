<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConnexionLogsTable extends Migration
{
    public function up()
    {
        Schema::create('connexion_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_utilisateur');
            $table->string('email');
            $table->string('role');
            $table->timestamp('connexion_at')->nullable();
            $table->timestamp('deconnexion_at')->nullable();
            $table->string('duree')->nullable();
            $table->timestamps();

            $table->foreign('id_utilisateur')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('connexion_logs');
    }
}