<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class SecretaireSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'identifier' => 'S-001',
            'name' => 'Dieng',
            'surname' => 'Sylvanie',
            'email' => 'sylvi@gmail.com',
            'password' => Hash::make('sylvi1234'),
            'role' => 'secretaire',
            'status' => 'active',
            'photo' => null,
            'last_login' => null,
            'remember_me' => false,
        ]);    
    }
}
