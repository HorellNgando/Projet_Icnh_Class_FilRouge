<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_patient', 'id_medecin', 'date_heure', 'service', 'statut', 'rappel_envoye'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'id_patient');
    }

    public function medecin()
    {
        return $this->belongsTo(Utilisateur::class, 'id_medecin');
    }
}