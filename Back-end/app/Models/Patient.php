<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_utilisateur', 'date_naissance', 'groupe_sanguin',
        'allergies', 'antecedents_medicaux', 'contact_urgence'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'id_patient');
    }

    public function dossiersMedicaux()
    {
        return $this->hasMany(DossierMedical::class, 'id_patient');
    }

    public function factures()
    {
        return $this->hasMany(Facture::class, 'id_patient');
    }
}