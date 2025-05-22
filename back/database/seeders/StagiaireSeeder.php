<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StagiaireSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'identifier' => 'ST-001',
            'name' => 'Ntongue',
            'surname' => 'Erika',
            'email' => 'erika@gmail.com',
            'password' => Hash::make('erika1234'),
            'role' => 'stagiaire',
            'status' => 'active',
            'photo' => null,
            'last_login' => null,
            'remember_me' => false,
        ]);    
    }
}
