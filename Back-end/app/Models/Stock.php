<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_pharmacien', 'produit', 'categorie', 'quantite', 'seuil_alerte', 'statut'
    ];

    public function pharmacien()
    {
        return $this->belongsTo(Utilisateur::class, 'id_pharmacien');
    }
}