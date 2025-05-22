<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'identifier' => 'A-001',
            'name' => 'Horell',
            'surname' => 'Ngando',
            'email' => 'ngandohorell1@gmail.com',
            'password' => Hash::make('karellekarmen1'),
            'role' => 'admin',
            'status' => 'active',
            'photo' => null,
            'last_login' => null,
            'remember_me' => false,
        ]);
    }
}