<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->unique(); // A-xxx, P-xxx, M-xxx, S-xxx, ST-xxx
            $table->string('name');
            $table->string('surname');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->string('role'); // admin, patient, medecin, secretaire, infirmier, stagiaire
            $table->string('status')->default('active'); // active, fired, on_leave
            $table->string('photo')->nullable();
            $table->timestamp('last_login')->nullable();
            $table->boolean('remember_me')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};