<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class MedecinSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'identifier' => 'M-001',
            'name' => 'Eugene',
            'surname' => 'Robert',
            'email' => 'robert@gmail.com',
            'password' => Hash::make('robert123'),
            'role' => 'medecin',
            'status' => 'active',
            'photo' => null,
            'last_login' => null,
            'remember_me' => false,
        ]);    
    }
}
