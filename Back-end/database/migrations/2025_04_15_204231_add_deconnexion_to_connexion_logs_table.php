<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeconnexionToConnexionLogsTable extends Migration
{
    public function up()
    {
        Schema::table('connexion_logs', function (Blueprint $table) {
            $table->timestamp('deconnexion_at')->nullable()->after('connexion_at');
            $table->string('duree')->nullable()->after('deconnexion_at');
        });
    }

    public function down()
    {
        Schema::table('connexion_logs', function (Blueprint $table) {
            $table->dropColumn(['deconnexion_at', 'duree']);
        });
    }
}