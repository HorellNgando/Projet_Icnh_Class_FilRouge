<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Patient extends Model
{
    protected $fillable = [
        'identifier',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'nationality',
        'address',
        'phone',
        'email',
        'marital_status',
        'emergency_contact_name',
        'emergency_contact_relation',
        'emergency_contact_phone',
        'document_type',
        'document_number',
        'blood_group',
        'height_cm',
        'weight_kg',
        'allergies',
        'allergy_details',
        'vital_signs',
        'medical_history',
        'surgical_history',
        'current_treatments',
        'admission_date',
        'admission_type',
        'admission_reason',
        'service',
        'doctor_id',
        'room',
        'bed',
        'room_type',
        'special_equipment',
        'precautions',
        'payment_type',
        'insurance_details',
        'documents',
        'estimated_stay_days',
        'daily_cost',
        'total_cost',
        'payment_terms',
        'administrative_notes',
        'discharge_date',
        'final_diagnosis',
        'stay_summary',
        'prescribed_treatment',
        'patient_instructions',
        'follow_up_date',
        'follow_up_doctor_id',
        'discharge_documents',
        'discharge_confirmed',
    ];

    protected $casts = [
        'allergies' => 'array',
        'vital_signs' => 'array',
        'medical_history' => 'array',
        'surgical_history' => 'array',
        'current_treatments' => 'array',
        'special_equipment' => 'array',
        'precautions' => 'array',
        'insurance_details' => 'array',
        'documents' => 'array',
        'prescribed_treatment' => 'array',
        'discharge_documents' => 'array',
        'discharge_confirmed' => 'boolean',
        'date_of_birth' => 'date',
        'admission_date' => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id', 'identifier');
    }

    /**
     * Automatically generate identifier, calculate total_cost, and handle discharge_confirmed.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate unique identifier
        static::creating(function ($patient) {
            if (empty($patient->identifier)) {
                $patient->identifier = self::generateUniqueIdentifier();
            }
        });

        // Calculate total_cost and handle discharge_confirmed
        static::saving(function ($patient) {
            // Calculate total_cost
            if (!is_null($patient->estimated_stay_days) && !is_null($patient->daily_cost)) {
                $patient->total_cost = $patient->estimated_stay_days * $patient->daily_cost;
            }

            // Set discharge_date if discharge_confirmed is true and discharge_date is empty
            if ($patient->discharge_confirmed && is_null($patient->discharge_date)) {
                $patient->discharge_date = Carbon::now();
            } elseif (!$patient->discharge_confirmed) {
                $patient->discharge_date = null; // Reset discharge_date if discharge_confirmed is unchecked
            }
        });
    }

    /**
     * Generate a unique identifier in the format PAT-XXXXXX.
     */
    protected static function generateUniqueIdentifier()
    {
        do {
            $number = mt_rand(100000, 999999); // Generate a random 6-digit number
            $identifier = 'PAT-' . $number;
        } while (self::where('identifier', $identifier)->exists());

        return $identifier;
    }
}