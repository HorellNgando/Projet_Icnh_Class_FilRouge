<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConnexionLog extends Model
{
    protected $table = 'connexion_logs';

    protected $fillable = [
        'id_utilisateur', 'email', 'role', 'connexion_at', 'deconnexion_at',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }
}