<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DossierMedical extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_patient', 'diagnostics', 'prescriptions', 'resultats_analyses', 'date_creation', 'fichier_url'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'id_patient');
    }
}