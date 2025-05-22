<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        switch ($role) {
            case 'admin':
            case 'medecin':
            case 'infirmier':
            case 'stagiaire':
                $prescriptions = Prescription::with(['patient', 'doctor'])->get();
                break;
            case 'patient':
                $prescriptions = Prescription::with(['patient', 'doctor'])
                    ->where('patient_id', $user->id)
                    ->get();
                break;
            default:
                return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        return response()->json($prescriptions);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        if (!in_array($role, ['admin', 'medecin'])) {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'medications' => 'required|array',
            'medications.*.name' => 'required|string',
            'medications.*.dosage' => 'required|string',
            'medications.*.frequency' => 'required|string',
            'medications.*.duration' => 'required|string',
            'notes' => 'nullable|string',
            'valid_until' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if ($role === 'medecin') {
            $data['doctor_id'] = $user->id;
        }

        $prescription = Prescription::create($data);
        return response()->json($prescription, 201);
    }

    public function show(Request $request, Prescription $prescription)
    {
        $user = $request->user();
        $role = $user->role;

        switch ($role) {
            case 'admin':
            case 'medecin':
            case 'infirmier':
            case 'stagiaire':
                break;
            case 'patient':
                $patient = \App\Models\Patient::where('email', $user->email)->first();
                if (!$patient || $prescription->patient_id !== $patient->id) {
                    return response()->json(['error' => 'Accès non autorisé'], 403);
                }
                break;
            default:
                return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        return response()->json($prescription->load(['patient', 'doctor']));
    }

    public function update(Request $request, Prescription $prescription)
    {
        $user = $request->user();
        $role = $user->role;

        if (!in_array($role, ['admin', 'medecin'])) {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        if ($role === 'medecin' && $prescription->doctor_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'medications' => 'array',
            'medications.*.name' => 'string',
            'medications.*.dosage' => 'string',
            'medications.*.frequency' => 'string',
            'medications.*.duration' => 'string',
            'notes' => 'nullable|string',
            'valid_until' => 'date',
            'status' => 'in:active,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $prescription->update($request->all());
        return response()->json($prescription);
    }

    public function destroy(Request $request, Prescription $prescription)
    {
        $user = $request->user();
        $role = $user->role;

        if ($role !== 'admin') {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        $prescription->delete();
        return response()->json(null, 204);
    }

    public function getByPatient(Request $request, $patientId)
    {
        $user = $request->user();
        $role = $user->role;

        if ($role === 'patient') {
            $patient = \App\Models\Patient::where('email', $user->email)->first();
            if (!$patient || $patient->id != $patientId) {
                return response()->json(['error' => 'Accès non autorisé'], 403);
            }
        }

        $prescriptions = Prescription::with(['patient', 'doctor'])
            ->where('patient_id', $patientId)
            ->get();

        return response()->json($prescriptions);
    }

    public function getByDoctor(Request $request, $doctorId)
    {
        $user = $request->user();
        $role = $user->role;

        if ($role === 'medecin' && $user->id !== $doctorId) {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        $prescriptions = Prescription::with(['patient', 'doctor'])
            ->where('doctor_id', $doctorId)
            ->get();

        return response()->json($prescriptions);
    }
} 