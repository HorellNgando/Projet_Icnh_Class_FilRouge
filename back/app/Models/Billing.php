<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'invoice_number',
        'amount',
        'items',
        'status',
        'due_date',
        'payment_date',
        'notes',
    ];

    protected $casts = [
        'items' => 'array',
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'payment_date' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 