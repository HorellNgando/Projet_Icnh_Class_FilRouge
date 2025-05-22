<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAllergyDetailsToPatientsTable extends Migration
{
    public function up()
    {
        Schema::table('patients', function (Blueprint $table) {
            // Ajouter la colonne allergy_details si elle n'existe pas
            if (!Schema::hasColumn('patients', 'allergy_details')) {
                $table->text('allergy_details')->nullable()->after('allergies');
            }
        });
    }

    public function down()
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn('allergy_details');
        });
    }
}