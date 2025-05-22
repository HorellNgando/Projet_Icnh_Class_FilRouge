<?php
namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PatientsExport;
use Illuminate\Support\Facades\Gate;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Patient::class);
        $query = Patient::select('id', 'identifier', 'first_name', 'last_name', 'date_of_birth', 'gender', 'email', 'phone');

        if ($request->has('search')) {
            $query->where('identifier', 'like', '%' . $request->search . '%')
                  ->orWhere('first_name', 'like', '%' . $request->search . '%')
                  ->orWhere('last_name', 'like', '%' . $request->search . '%')
                  ->orWhere('room', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('discharge_confirmed', false);
            } elseif ($request->status === 'discharged') {
                $query->where('discharge_confirmed', true);
            }
        }

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        // Si la requête demande une liste complète (pour les selects), ne pas paginer
        if ($request->has('all') && $request->all === 'true') {
            return response()->json($query->get());
        }

        // Sinon, paginer les résultats
        $patients = $query->paginate(10);
        
        // Format the data
        $patients->getCollection()->transform(function ($patient) {
            $patient->doctor_name = $patient->doctor ? $patient->doctor->name . ' ' . $patient->doctor->surname : 'N/A';
            $patient->birth_date = $patient->date_of_birth ? $patient->date_of_birth->format('y/m/d') : null;
            $patient->admission_date_formatted = $patient->admission_date ? $patient->admission_date->format('y/m/d') : null;
            return $patient;
        });

        return $patients;
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Patient::class);
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'nationality' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_relation' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'document_type' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'height_cm' => 'nullable|numeric',
            'weight_kg' => 'nullable|numeric',
            'allergies' => 'nullable|array',
            'allergy_details' => 'nullable|string',
            'vital_signs' => 'nullable|array',
            'medical_history' => 'nullable|array',
            'surgical_history' => 'nullable|array',
            'current_treatments' => 'nullable|array',
            'admission_date' => 'nullable|date',
            'admission_type' => 'nullable|in:programmee,urgence,transfert',
            'admission_reason' => 'nullable|string',
            'service' => 'nullable|string|max:255',
            'doctor_id' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
            'bed' => 'nullable|string|max:255',
            'room_type' => 'nullable|in:single,double,suite',
            'special_equipment' => 'nullable|array',
            'precautions' => 'nullable|array',
            'payment_type' => 'nullable|in:assurance_maladie,assurance_privee,auto_paiement,autre',
            'insurance_details' => 'nullable|array',
            'documents' => 'nullable|array',
            'estimated_stay_days' => 'nullable|integer',
            'daily_cost' => 'nullable|numeric',
            'total_cost' => 'nullable|numeric',
            'payment_terms' => 'nullable|in:direct,differe,echelonne',
            'administrative_notes' => 'nullable|string',
            'discharge_date' => 'nullable|date',
            'final_diagnosis' => 'nullable|string',
            'stay_summary' => 'nullable|string',
            'prescribed_treatment' => 'nullable|array',
            'patient_instructions' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
            'follow_up_doctor_id' => 'nullable|string|max:255',
            'discharge_documents' => 'nullable|array',
            'discharge_confirmed' => 'nullable|boolean',
        ]);

        $patient = Patient::create($validated);
        return response()->json($patient, 201);
    }

    public function show(Patient $patient)
    {
        Gate::authorize('view', $patient);
        return response()->json($patient);
    }

    public function update(Request $request, Patient $patient)
    {
        Gate::authorize('update', $patient);
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'nationality' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_relation' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'document_type' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'height_cm' => 'nullable|numeric',
            'weight_kg' => 'nullable|numeric',
            'allergies' => 'nullable|array',
            'allergy_details' => 'nullable|string',
            'vital_signs' => 'nullable|array',
            'medical_history' => 'nullable|array',
            'surgical_history' => 'nullable|array',
            'current_treatments' => 'nullable|array',
            'admission_date' => 'nullable|date',
            'admission_type' => 'nullable|in:programmee,urgence,transfert',
            'admission_reason' => 'nullable|string',
            'service' => 'nullable|string|max:255',
            'doctor_id' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
            'bed' => 'nullable|string|max:255',
            'room_type' => 'nullable|in:single,double,suite',
            'special_equipment' => 'nullable|array',
            'precautions' => 'nullable|array',
            'payment_type' => 'nullable|in:assurance_maladie,assurance_privee,auto_paiement,autre',
            'insurance_details' => 'nullable|array',
            'documents' => 'nullable|array',
            'estimated_stay_days' => 'nullable|integer',
            'daily_cost' => 'nullable|numeric',
            'total_cost' => 'nullable|numeric',
            'payment_terms' => 'nullable|in:direct,differe,echelonne',
            'administrative_notes' => 'nullable|string',
            'discharge_date' => 'nullable|date',
            'final_diagnosis' => 'nullable|string',
            'stay_summary' => 'nullable|string',
            'prescribed_treatment' => 'nullable|array',
            'patient_instructions' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
            'follow_up_doctor_id' => 'nullable|string|max:255',
            'discharge_documents' => 'nullable|array',
            'discharge_confirmed' => 'nullable|boolean',
        ]);

        $patient->update($validated);
        return response()->json($patient);
    }

    public function destroy(Patient $patient)
    {
        Gate::authorize('delete', $patient);
        $patient->delete();
        return response()->json(null, 204);
    }

    public function exportPDF()
    {
        Gate::authorize('viewAny', Patient::class);
        $patients = Patient::all();
        $pdf = PDF::loadView('pdf.patients', compact('patients'));
        return $pdf->download('patients.pdf');
    }

    public function exportExcel()
    {
        Gate::authorize('viewAny', Patient::class);
        return Excel::download(new PatientsExport, 'patients.xlsx');
    }

    public function exportMedicalRecordPDF(Patient $patient)
    {
        Gate::authorize('view', $patient);
        $pdf = PDF::loadView('pdf.medical_record', compact('patient'));
        return $pdf->download("dossier_medical_{$patient->identifier}.pdf");
    }

    public function getActiveDoctors()
    {
        Gate::authorize('viewAny', Patient::class);
        $doctors = User::where('role', 'medecin')
                       ->where('status', 'active')
                       ->select('identifier', 'name')
                       ->get();
        return response()->json($doctors);
    }

    public function getMyPatientData(Request $request) {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)
                    //  ->where('first_name', $user->name)
                    //  ->where('last_name', $user->surname)
                    ->first();
        // return response()->json($patient);
        if (!$patient) {
            return response()->json(['message' => 'Aucun dossier médical trouvé'], 404);
        }
        return response()->json($patient);
    }

    public function getDoctorPatients(Request $request, $doctorId)
    {
        // Vérifier que l'utilisateur connecté est bien le médecin demandé
        if ($request->user()->identifier !== $doctorId) {
            return response()->json(['message' => 'Non autorisé à accéder à ces patients'], 403);
        }

        $query = Patient::where('doctor_id', $doctorId);

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('identifier', 'like', '%' . $request->search . '%')
                  ->orWhere('first_name', 'like', '%' . $request->search . '%')
                  ->orWhere('last_name', 'like', '%' . $request->search . '%')
                  ->orWhere('room', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('discharge_confirmed', false);
            } elseif ($request->status === 'discharged') {
                $query->where('discharge_confirmed', true);
            }
        }

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        return $query->paginate(10);
    }
}