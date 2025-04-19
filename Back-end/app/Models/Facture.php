<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_patient', 'montant', 'date_emission', 'statut', 'assurance'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'id_patient');
    }
}