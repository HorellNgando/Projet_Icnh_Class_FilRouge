<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterIdUtilisateurToString extends Migration
{
    public function up()
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->string('id_utilisateur', 10)->change(); // Ajustez la longueur (10) selon vos besoins
        });
    }

    public function down()
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->integer('id_utilisateur')->change(); // Revenir à integer si rollback
        });
    }
}