<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            MedecinSeeder::class,
            InfirmierSeeder::class,
            SecretaireSeeder::class,   
            StagiaireSeeder::class
        ]);
    }
}