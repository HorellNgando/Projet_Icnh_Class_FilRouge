<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_utilisateur', 'nom', 'prenom', 'email', 'telephone', 'password', 'role', 'status',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->hasOne(Patient::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function connexionLogs()
    {
        return $this->hasMany(ConnexionLog::class, 'id_utilisateur', 'id_utilisateur');
    }
}