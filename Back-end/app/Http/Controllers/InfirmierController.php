<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Utilisateur;
use App\Models\DossierMedical;
use App\Models\ConnexionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class InfirmierController extends Controller
{
    public function patients(Request $request)
    {
        $infirmier = $request->user();
        $patients = Patient::whereHas('utilisateur', function ($query) use ($infirmier) {
            $query->where('infirmier_id', $infirmier->id_utilisateur);
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

    public function lastLogin(Request $request)
    {
        $log = ConnexionLog::where('id_utilisateur', $request->user()->id_utilisateur)
            ->orderBy('connexion_at', 'desc')
            ->first();
        return response()->json([
            'last_login' => $log ? $log->connexion_at->format('d/m/Y H:i') : 'N/A',
        ]);
    }

    public function addPatient(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'sexe' => 'required|in:Masculin,Féminin',
            'nationalite' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255|unique:utilisateurs',
            'situation_matrimoniale' => 'nullable|in:Célibataire,Marié(e),Divorcé(e),Veuf/Veuve',
            'contact_urgence' => 'required|string|max:255',
            'telephone_urgence' => 'required|string|max:20',
            'type_document' => 'nullable|in:CNI,Passeport',
            'numero_document' => 'nullable|string|max:50',
            'groupe_sanguin' => 'nullable|in:O+,O-,A+,A-,B+,B-,AB+,AB-',
            'allergies' => 'nullable|string',
            'taille' => 'nullable|numeric',
            'poids' => 'nullable|numeric',
            'temperature' => 'nullable|numeric',
            'tension_avc' => 'nullable|string|max:50',
            'pouls' => 'nullable|numeric',
            'antecedents_medicaux' => 'nullable|string',
            'antecedents_chirurgicaux' => 'nullable|string',
            'traitement_en_cours' => 'nullable|string',
            'date_admission' => 'required|date',
            'heure_admission' => 'required',
            'type_admission' => 'nullable|in:Urgence,Programmée',
            'motif_admission' => 'nullable|string',
            'service' => 'required|string|max:255',
            'medecin_traitant' => 'required|string|max:255',
            'chambre' => 'nullable|string|max:50',
            'lit' => 'nullable|string|max:50',
            'type_chambre' => 'nullable|in:Individuelle,Double,Commune',
            'equipements_requis' => 'nullable|string',
            'oxygen' => 'nullable|in:Oui,Non',
            'precaution_particuliere' => 'nullable|string',
            'type_paiement' => 'nullable|in:Espèces,Assurance,Carte',
            'documents_fournis' => 'nullable|string',
            'numero_assurance' => 'nullable|string|max:50',
            'numero_police' => 'nullable|string|max:50',
            'titre_assurance' => 'nullable|string|max:255',
            'cout_journalier' => 'nullable|numeric',
            'duree_hospitalisation' => 'nullable|numeric',
            'cout_total_estime' => 'nullable|numeric',
            'couverture_assurance' => 'nullable|string',
            'modalite_paiement' => 'nullable|string',
            'relation_patient' => 'nullable|string|max:255',
            'precaution_particuliere_admin' => 'nullable|string',
            'date_sortie' => 'nullable|date',
            'heure_sortie' => 'nullable',
            'type_sortie' => 'nullable|in:Normale,Contre avis médical,Transfert',
            'diagnostic_final' => 'nullable|string',
            'evolution_sante' => 'nullable|string',
            'sejour_amelioration' => 'nullable|string',
            'date_prochain_rdv' => 'nullable|date',
            'medecin_rdv' => 'nullable|string|max:255',
            'traitement_prescrit' => 'nullable|string',
            'instruction_patient' => 'nullable|string',
            'documents_sortie' => 'nullable|string',
            'besoins_soins' => 'nullable|string',
        ]);

        $infirmier = $request->user();

        $user = Utilisateur::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'] ?? 'patient' . time() . '@example.com',
            'telephone' => $validated['telephone'],
            'password' => Hash::make('defaultpassword'),
            'role' => 'patient',
        ]);

        $patient = Patient::create([
            'id_utilisateur' => $user->id_utilisateur,
            'infirmier_id' => $infirmier->id_utilisateur,
            'medecin_id' => null, // À remplir après, si nécessaire
            'date_admission' => $validated['date_admission'],
            'statut' => 'En cours',
        ]);

        DossierMedical::create([
            'id_patient' => $patient->id_patient,
            'date_de_naissance' => $validated['date_de_naissance'],
            'sexe' => $validated['sexe'],
            'nationalite' => $validated['nationalite'],
            'adresse' => $validated['adresse'],
            'situation_matrimoniale' => $validated['situation_matrimoniale'],
            'contact_urgence' => $validated['contact_urgence'],
            'telephone_urgence' => $validated['telephone_urgence'],
            'type_document' => $validated['type_document'],
            'numero_document' => $validated['numero_document'],
            'groupe_sanguin' => $validated['groupe_sanguin'],
            'allergies' => $validated['allergies'],
            'taille' => $validated['taille'],
            'poids' => $validated['poids'],
            'temperature' => $validated['temperature'],
            'tension_avc' => $validated['tension_avc'],
            'pouls' => $validated['pouls'],
            'antecedents_medicaux' => $validated['antecedents_medicaux'],
            'antecedents_chirurgicaux' => $validated['antecedents_chirurgicaux'],
            'traitement_en_cours' => $validated['traitement_en_cours'],
            'date_admission' => $validated['date_admission'],
            'heure_admission' => $validated['heure_admission'],
            'type_admission' => $validated['type_admission'],
            'motif_admission' => $validated['motif_admission'],
            'service' => $validated['service'],
            'medecin_traitant' => $validated['medecin_traitant'],
            'chambre' => $validated['chambre'],
            'lit' => $validated['lit'],
            'type_chambre' => $validated['type_chambre'],
            'equipements_requis' => $validated['equipements_requis'],
            'oxygen' => $validated['oxygen'],
            'precaution_particuliere' => $validated['precaution_particuliere'],
            'type_paiement' => $validated['type_paiement'],
            'documents_fournis' => $validated['documents_fournis'],
            'numero_assurance' => $validated['numero_assurance'],
            'numero_police' => $validated['numero_police'],
            'titre_assurance' => $validated['titre_assurance'],
            'cout_journalier' => $validated['cout_journalier'],
            'duree_hospitalisation' => $validated['duree_hospitalisation'],
            'cout_total_estime' => $validated['cout_total_estime'],
            'couverture_assurance' => $validated['couverture_assurance'],
            'modalite_paiement' => $validated['modalite_paiement'],
            'relation_patient' => $validated['relation_patient'],
            'precaution_particuliere_admin' => $validated['precaution_particuliere_admin'],
            'date_sortie' => $validated['date_sortie'],
            'heure_sortie' => $validated['heure_sortie'],
            'type_sortie' => $validated['type_sortie'],
            'diagnostic_final' => $validated['diagnostic_final'],
            'evolution_sante' => $validated['evolution_sante'],
            'sejour_amelioration' => $validated['sejour_amelioration'],
            'date_prochain_rdv' => $validated['date_prochain_rdv'],
            'medecin_rdv' => $validated['medecin_rdv'],
            'traitement_prescrit' => $validated['traitement_prescrit'],
            'instruction_patient' => $validated['instruction_patient'],
            'documents_sortie' => $validated['documents_sortie'],
            'besoins_soins' => $validated['besoins_soins'],
        ]);

        return response()->json(['message' => 'Patient ajouté avec succès'], 201);
    }
}