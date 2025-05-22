<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdatePatientsTableIdentifier extends Migration
{
    public function up()
    {
        Schema::table('patients', function (Blueprint $table) {
            // Vérifier si l'index unique existe déjà
            $indexExists = DB::select(
                "SHOW INDEXES FROM patients WHERE Key_name = 'patients_identifier_unique'"
            );

            if (empty($indexExists)) {
                $table->string('identifier')->unique()->change();
            }
        });
    }

    public function down()
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropUnique(['identifier']);
        });
    }
}