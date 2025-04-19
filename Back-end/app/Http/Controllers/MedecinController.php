<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Utilisateur;
use App\Models\ConnexionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MedecinController extends Controller
{
    public function patients(Request $request)
    {
        $medecin = $request->user();
        $patients = Patient::whereHas('utilisateur', function ($query) use ($medecin) {
            $query->where('medecin_id', $medecin->id_utilisateur);
        })->with('utilisateur')->get();

        return response()->json($patients->map(function ($patient) {
            return [
                'id' => 'P' . str_pad($patient->id_patient, 3, '0', STR_PAD_LEFT),
                'nom' => $patient->utilisateur->nom . ' ' . $patient->utilisateur->prenom,
                'date_admission' => $patient->date_admission ?? '2023-06-10',
                'statut' => $patient->statut ?? 'En cours',
            ];
        }));
    }

    public function appointments(Request $request)
    {
        $medecin = $request->user();
        // À remplacer par une vraie logique pour les rendez-vous
        return response()->json([
            [
                'date' => '15 mars 2025, 10:30',
                'patient' => 'Marie Dubois',
                'service' => $medecin->service ?? 'Cardiologie',
                'statut' => 'Confirmé',
            ],
            [
                'date' => '22 mars 2025, 14:00',
                'patient' => 'Jean Martin',
                'service' => $medecin->service ?? 'Cardiologie',
                'statut' => 'En attente',
            ],
        ]);
    }

    public function lastLogin(Request $request)
    {
        $log = ConnexionLog::where('id_utilisateur', $request->user()->id_utilisateur)
            ->orderBy('connexion_at', 'desc')
            ->first();
        return response()->json([
            'last_login' => $log ? $log->connexion_at->format('d/m/Y H:i') : 'N/A',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'telephone' => 'required|string|max:20',
            'service' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            $path = $request->file('photo')->store('photos', 'public');
            $user->photo = $path;
        }

        $user->update([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'service' => $validated['service'],
        ]);

        return response()->json(['message' => 'Profil mis à jour avec succès']);
    }
}