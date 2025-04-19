<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Utilisateur::create([
            'id_utilisateur' => 'U001',
            'nom' => 'Horell',
            'prenom' => 'Ngando',
            'email' => 'ngandohorell1@gmail.com',
            'telephone' => '+237698819573',
            'adresse' => 'Akwa-Nord',
            'mot_de_passe' => Hash::make('karellekarmen1'),
            'role' => 'admin',
            'status' => 'actif',
        ]);
    }
}