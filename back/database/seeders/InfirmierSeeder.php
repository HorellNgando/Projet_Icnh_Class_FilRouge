<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class InfirmierSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'identifier' => 'I-001',
            'name' => 'Ewombe',
            'surname' => 'Suzanne',
            'email' => 'suzy@gmail.com',
            'password' => Hash::make('suzy1234'),
            'role' => 'infirmier',
            'status' => 'active',
            'photo' => null,
            'last_login' => null,
            'remember_me' => false,
        ]);    
    }
}
