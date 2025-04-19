<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\DossierMedical;
use App\Models\ConnexionLog;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function appointments(Request $request)
    {
        // Logique pour les rendez-vous (à remplacer par une vraie implémentation)
        return response()->json([]);
    }

    public function messages(Request $request)
    {
        // Logique pour les messages (à remplacer par une vraie implémentation)
        return response()->json([]);
    }

    public function health(Request $request)
    {
        // Logique pour la santé (à remplacer par une vraie implémentation)
        return response()->json([]);
    }

    public function getPatient(Request $request, $id)
    {
        $patient = Patient::where('id_patient', str_replace('P', '', $id))->with('utilisateur', 'dossierMedical')->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }

        $dossier = $patient->dossierMedical;

        return response()->json([
            'id' => 'P' . str_pad($patient->id_patient, 3, '0', STR_PAD_LEFT),
            'nom' => $patient->utilisateur->nom,
            'prenom' => $patient->utilisateur->prenom,
            'date_de_naissance' => $dossier->date_de_naissance,
            'sexe' => $dossier->sexe,
            'nationalite' => $dossier->nationalite,
            'adresse' => $dossier->adresse,
            'telephone' => $patient->utilisateur->telephone,
            'email' => $patient->utilisateur->email,
            'situation_matrimoniale' => $dossier->situation_matrimoniale,
            'contact_urgence' => $dossier->contact_urgence,
            'telephone_urgence' => $dossier->telephone_urgence,
            'type_document' => $dossier->type_document,
            'numero_document' => $dossier->numero_document,
            'groupe_sanguin' => $dossier->groupe_sanguin,
            'allergies' => $dossier->allergies,
            'taille' => $dossier->taille,
            'poids' => $dossier->poids,
            'temperature' => $dossier->temperature,
            'tension_avc' => $dossier->tension_avc,
            'pouls' => $dossier->pouls,
            'antecedents_medicaux' => $dossier->antecedents_medicaux,
            'antecedents_chirurgicaux' => $dossier->antecedents_chirurgicaux,
            'traitement_en_cours' => $dossier->traitement_en_cours,
            'date_admission' => $dossier->date_admission,
            'heure_admission' => $dossier->heure_admission,
            'type_admission' => $dossier->type_admission,
            'motif_admission' => $dossier->motif_admission,
            'service' => $dossier->service,
            'medecin_traitant' => $dossier->medecin_traitant,
            'chambre' => $dossier->chambre,
            'lit' => $dossier->lit,
            'type_chambre' => $dossier->type_chambre,
            'equipements_requis' => $dossier->equipements_requis,
            'oxygen' => $dossier->oxygen,
            'precaution_particuliere' => $dossier->precaution_particuliere,
            'type_paiement' => $dossier->type_paiement,
            'documents_fournis' => $dossier->documents_fournis,
            'numero_assurance' => $dossier->numero_assurance,
            'numero_police' => $dossier->numero_police,
            'titre_assurance' => $dossier->titre_assurance,
            'cout_journalier' => $dossier->cout_journalier,
            'duree_hospitalisation' => $dossier->duree_hospitalisation,
            'cout_total_estime' => $dossier->cout_total_estime,
            'couverture_assurance' => $dossier->couverture_assurance,
            'modalite_paiement' => $dossier->modalite_paiement,
            'relation_patient' => $dossier->relation_patient,
            'precaution_particuliere_admin' => $dossier->precaution_particuliere_admin,
            'date_sortie' => $dossier->date_sortie,
            'heure_sortie' => $dossier->heure_sortie,
            'type_sortie' => $dossier->type_sortie,
            'diagnostic_final' => $dossier->diagnostic_final,
            'evolution_sante' => $dossier->evolution_sante,
            'sejour_amelioration' => $dossier->sejour_amelioration,
            'date_prochain_rdv' => $dossier->date_prochain_rdv,
            'medecin_rdv' => $dossier->medecin_rdv,
            'traitement_prescrit' => $dossier->traitement_prescrit,
            'instruction_patient' => $dossier->instruction_patient,
            'documents_sortie' => $dossier->documents_sortie,
            'besoins_soins' => $dossier->besoins_soins,
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
}