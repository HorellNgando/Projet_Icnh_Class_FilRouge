<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\ConnexionLog;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $patients = Patient::count();
        $consultations = Patient::whereDate('created_at', today())->count();
        $occupancy = 78; // À calculer selon la logique de ton application
        $appointments = 42; // À calculer
        $staff = Utilisateur::where('role', '!=', 'patient')->count();
        $doctors = Utilisateur::where('role', 'medecin')->count();
        $nurses = Utilisateur::where('role', 'infirmier')->count();
        $technicians = Utilisateur::where('role', 'technicien')->count();
        $admins = Utilisateur::where('role', 'admin')->count();

        return response()->json([
            'patients' => $patients,
            'consultations' => $consultations,
            'occupancy' => $occupancy,
            'appointments' => $appointments,
            'staff' => $staff,
            'doctors' => $doctors,
            'nurses' => $nurses,
            'technicians' => $technicians,
            'admins' => $admins,
        ]);
    }

    public function recentPatients()
    {
        $patients = Patient::with('utilisateur')->orderBy('created_at', 'desc')->take(3)->get();
        return response()->json($patients->map(function ($patient) {
            return [
                'nom' => $patient->utilisateur->nom . ' ' . $patient->utilisateur->prenom,
                'id' => 'P-' . str_pad($patient->id_patient, 4, '0', STR_PAD_LEFT),
                'service' => 'Cardiologie', // À ajuster selon ta logique
                'medecin' => 'Dr Claire Moreau', // À ajuster
                'statut' => 'En observation', // À ajuster
            ];
        }));
    }

    public function criticalStocks()
    {
        // À remplacer par une vraie logique de stock
        return response()->json([
            ['produit' => 'Amoxiciline 500 mg', 'categorie' => 'Antibiotique', 'quantite' => '8 boîtes', 'seuil' => '10 boîtes'],
            ['produit' => 'Seringues 10ml', 'categorie' => 'Matériel médical', 'quantite' => '10', 'seuil' => '50'],
            ['produit' => 'Paracétamol 1g', 'categorie' => 'Analgésique', 'quantite' => '20 boîtes', 'seuil' => '50 boîtes'],
        ]);
    }

    public function revenues()
    {
        // À remplacer par une vraie logique de calcul des revenus
        return response()->json([
            'monthly' => '245 680',
            'pending' => '32 450 ',
            'expenses' => '187 320',
        ]);
    }

    public function logs()
    {
        $logs = ConnexionLog::with('utilisateur')->orderBy('connexion_at', 'desc')->take(10)->get();
        return response()->json($logs->map(function ($log) {
            return [
                'nom' => $log->utilisateur->nom . ' ' . $log->utilisateur->prenom,
                'email' => $log->email,
                'role' => $log->role,
                'connexion_at' => $log->connexion_at->format('d/m/Y H:i'),
                'deconnexion_at' => $log->deconnexion_at ? $log->deconnexion_at->format('d/m/Y H:i') : null,
                'duree' => $log->duree,
            ];
        }));
    }

    public function patients(Request $request)
    {
        $perPage = 5;
        $search = $request->query('search');
        $doctor = $request->query('doctor');

        $query = Patient::with('utilisateur')->orderBy('created_at', 'desc');

        if ($search) {
            $query->whereHas('utilisateur', function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                ->orWhere('prenom', 'like', "%{$search}%");
            })->orWhere('id_patient', 'like', "%{$search}%");
        }

        if ($doctor) {
            $query->where('docteur', $doctor); // À ajuster selon ta logique
        }

        $patients = $query->paginate($perPage);

        return response()->json($patients->map(function ($patient) {
            return [
                'id' => 'P' . str_pad($patient->id_patient, 3, '0', STR_PAD_LEFT),
                'nom' => $patient->utilisateur->nom . ' ' . $patient->utilisateur->prenom,
                'date_de_naissance' => $patient->date_de_naissance,
                'date_admission' => '2023-06-10', // À ajuster
                'docteur' => 'Dr Ndoumbe', // À ajuster
                'chambre' => '101', // À ajuster
                'statut' => 'En cours', // À ajuster
            ];
        }));
    }
}