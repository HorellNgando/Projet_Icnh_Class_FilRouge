<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientsTable extends Migration
{
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->string('gender');
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relation')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('document_type')->nullable();
            $table->string('document_number')->nullable();
            $table->string('blood_group')->nullable();
            $table->integer('height_cm')->nullable();
            $table->integer('weight_kg')->nullable();
            $table->json('allergies')->nullable();
            $table->text('allergy_details')->nullable();
            $table->json('vital_signs')->nullable();
            $table->json('medical_history')->nullable();
            $table->json('surgical_history')->nullable();
            $table->json('current_treatments')->nullable();
            $table->dateTime('admission_date')->nullable();
            $table->string('admission_type')->nullable();
            $table->text('admission_reason')->nullable();
            $table->string('service')->nullable();
            $table->string('doctor_id')->nullable();
            $table->string('room')->nullable();
            $table->string('bed')->nullable();
            $table->string('room_type')->nullable();
            $table->json('special_equipment')->nullable();
            $table->json('precautions')->nullable();
            $table->string('payment_type')->nullable();
            $table->json('insurance_details')->nullable();
            $table->json('documents')->nullable();
            $table->integer('estimated_stay_days')->nullable();
            $table->decimal('daily_cost', 10, 2)->nullable();
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->string('payment_terms')->nullable();
            $table->text('administrative_notes')->nullable();
            $table->dateTime('discharge_date')->nullable();
            $table->text('final_diagnosis')->nullable();
            $table->text('stay_summary')->nullable();
            $table->json('prescribed_treatment')->nullable();
            $table->text('patient_instructions')->nullable();
            $table->dateTime('follow_up_date')->nullable();
            $table->string('follow_up_doctor_id')->nullable();
            $table->json('discharge_documents')->nullable();
            $table->boolean('discharge_confirmed')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('patients');
    }
}