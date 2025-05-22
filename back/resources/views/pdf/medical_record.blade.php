<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dossier Médical - {{ $patient->identifier }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        h2 { color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; display: inline-block; width: 200px; }
        .value { display: inline-block; }
        ul { margin: 0; padding-left: 20px; }
    </style>
</head>
<body>
    <h1>Dossier Médical - {{ $patient->identifier }}</h1>

    <div class="section">
        <h2>Informations Personnelles</h2>
        <p><span class="label">Nom complet :</span> <span class="value">{{ $patient->first_name }} {{ $patient->last_name }}</span></p>
        <p><span class="label">Date de naissance :</span> <span class="value">{{ $patient->date_of_birth }}</span></p>
        <p><span class="label">Sexe :</span> <span class="value">{{ $patient->gender }}</span></p>
        <p><span class="label">Nationalité :</span> <span class="value">{{ $patient->nationality ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Adresse :</span> <span class="value">{{ $patient->address ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Téléphone :</span> <span class="value">{{ $patient->phone ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Email :</span> <span class="value">{{ $patient->email ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Situation matrimoniale :</span> <span class="value">{{ $patient->marital_status ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Contact d'urgence :</span> <span class="value">{{ $patient->emergency_contact_name ?? 'Non spécifié' }} ({{ $patient->emergency_contact_relation ?? 'Non spécifié' }}, {{ $patient->emergency_contact_phone ?? 'Non spécifié' }})</span></p>
        <p><span class="label">Document :</span> <span class="value">{{ $patient->document_type ?? 'Non spécifié' }} {{ $patient->document_number ?? '' }}</span></p>
    </div>

    <div class="section">
        <h2>Informations Médicales</h2>
        <p><span class="label">Groupe sanguin :</span> <span class="value">{{ $patient->blood_group ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Taille :</span> <span class="value">{{ $patient->height_cm ?? 'Non spécifié' }} cm</span></p>
        <p><span class="label">Poids :</span> <span class="value">{{ $patient->weight_kg ?? 'Non spécifié' }} kg</span></p>
        <p><span class="label">Allergies :</span> <span class="value">
            @if($patient->allergies)
                @if(!empty($patient->allergies['medicaments'])) Médicamenteuses: {{ implode(', ', $patient->allergies['medicaments']) }} @endif
                @if(!empty($patient->allergies['alimentaires'])) Alimentaires: {{ implode(', ', $patient->allergies['alimentaires']) }} @endif
                @if(!empty($patient->allergies['autres'])) Autres: {{ implode(', ', $patient->allergies['autres']) }} @endif
            @else
                Aucune
            @endif
        </span></p>
        <p><span class="label">Détails des allergies :</span> <span class="value">{{ $patient->allergy_details ?? 'Aucun' }}</span></p>
        <p><span class="label">Signes vitaux :</span> <span class="value">
            @if($patient->vital_signs)
                Température: {{ $patient->vital_signs['temperature'] ?? 'Non spécifié' }} °C,
                Tension: {{ $patient->vital_signs['tension'] ?? 'Non spécifié' }},
                Pouls: {{ $patient->vital_signs['pouls'] ?? 'Non spécifié' }}
            @else
                Non spécifié
            @endif
        </span></p>
        <p><span class="label">Antécédents médicaux :</span> <span class="value">
            @if($patient->medical_history)
                @php
                    $conditions = [];
                    if ($patient->medical_history['diabete']) $conditions[] = 'Diabète';
                    if ($patient->medical_history['hypertension']) $conditions[] = 'Hypertension';
                    if ($patient->medical_history['cancer']) $conditions[] = 'Cancer';
                    if ($patient->medical_history['respiratoire']) $conditions[] = 'Problèmes respiratoires';
                    if ($patient->medical_history['cardiaque']) $conditions[] = 'Problèmes cardiaques';
                    if (!empty($patient->medical_history['autres'])) $conditions[] = $patient->medical_history['autres'];
                @endphp
                {{ !empty($conditions) ? implode(', ', $conditions) : 'Aucun' }}
            @else
                Aucun
            @endif
        </span></p>
        <p><span class="label">Antécédents chirurgiques :</span> <span class="value">
            @if($patient->surgical_history)
                <ul>
                    @foreach($patient->surgical_history as $surgery)
                        <li>{{ $surgery }}</li>
                    @endforeach
                </ul>
            @else
                Aucun
            @endif
        </span></p>
        <p><span class="label">Traitements en cours :</span> <span class="value">
            @if($patient->current_treatments)
                <ul>
                    @foreach($patient->current_treatments as $treatment)
                        <li>{{ $treatment }}</li>
                    @endforeach
                </ul>
            @else
                Aucun
            @endif
        </span></p>
    </div>

    <div class="section">
        <h2>Admission</h2>
        <p><span class="label">Date d'admission :</span> <span class="value">{{ $patient->admission_date ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Type d'admission :</span> <span class="value">{{ $patient->admission_type ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Motif d'admission :</span> <span class="value">{{ $patient->admission_reason ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Service :</span> <span class="value">{{ $patient->service ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Médecin responsable :</span> <span class="value">
            @php
                $doctor = \App\Models\User::where('identifier', $patient->doctor_id)->first();
            @endphp
            {{ $doctor ? $doctor->name . ' (' . $doctor->identifier . ')' : 'Non spécifié' }}
        </span></p>
        <p><span class="label">Chambre :</span> <span class="value">{{ $patient->room ?? 'Non spécifié' }} (Lit: {{ $patient->bed ?? 'Non spécifié' }})</span></p>
        <p><span class="label">Type de chambre :</span> <span class="value">{{ $patient->room_type ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Équipements spéciaux :</span> <span class="value">
            @if($patient->special_equipment)
                @php
                    $equipment = [];
                    if ($patient->special_equipment['oxygene']) $equipment[] = 'Oxygène';
                    if ($patient->special_equipment['aspiration']) $equipment[] = 'Aspiration';
                    if ($patient->special_equipment['ventilation']) $equipment[] = 'Ventilation';
                    if ($patient->special_equipment['pompe_perfusion']) $equipment[] = 'Pompe à perfusion';
                    if ($patient->special_equipment['moniteur_cardiaque']) $equipment[] = 'Moniteur cardiaque';
                    if (!empty($patient->special_equipment['autre'])) $equipment[] = $patient->special_equipment['autre'];
                @endphp
                {{ !empty($equipment) ? implode(', ', $equipment) : 'Aucun' }}
            @else
                Aucun
            @endif
        </span></p>
        <p><span class="label">Précautions :</span> <span class="value">
            @if($patient->precautions)
                @php
                    $precautions = [];
                    if ($patient->precautions['chute']) $precautions[] = 'Risque de chute';
                    if ($patient->precautions['infection']) $precautions[] = 'Risque d\'infection';
                    if ($patient->precautions['regime_special']) $precautions[] = 'Régime alimentaire spécial';
                    if (!empty($patient->precautions['notes'])) $precautions[] = $patient->precautions['notes'];
                @endphp
                {{ !empty($precautions) ? implode(', ', $precautions) : 'Aucun' }}
            @else
                Aucun
            @endif
        </span></p>
    </div>

    <div class="section">
        <h2>Gestion Administrative</h2>
        <p><span class="label">Type de prise en charge :</span> <span class="value">{{ $patient->payment_type ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Détails assurance :</span> <span class="value">
            @if($patient->insurance_details)
                Compagnie: {{ $patient->insurance_details['compagnie'] ?? 'Non spécifié' }},
                Titulaire: {{ $patient->insurance_details['titulaire'] ?? 'Non spécifié' }},
                Couverture: {{ $patient->insurance_details['couverture'] ?? 'Non spécifié' }}
            @else
                Non spécifié
            @endif
        </span></p>
        <p><span class="label">Documents fournis :</span> <span class="value">
            @if($patient->documents)
                @php
                    $docs = [];
                    if ($patient->documents['consentement']) $docs[] = 'Formulaire de consentement';
                    if ($patient->documents['reference']) $docs[] = 'Lettre de référence';
                    if (!empty($patient->documents['autres'])) $docs[] = $patient->documents['autres'];
                @endphp
                {{ !empty($docs) ? implode(', ', $docs) : 'Aucun' }}
            @else
                Aucun
            @endif
        </span></p>
        <p><span class="label">Durée estimée :</span> <span class="value">{{ $patient->estimated_stay_days ?? 'Non spécifié' }} jours</span></p>
        <p><span class="label">Coût journalier :</span> <span class="value">{{ $patient->daily_cost ?? 'Non spécifié' }} FCFA</span></p>
        <p><span class="label">Coût total :</span> <span class="value">{{ $patient->total_cost ?? 'Non spécifié' }} FCFA</span></p>
        <p><span class="label">Modalités de paiement :</span> <span class="value">{{ $patient->payment_terms ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Notes administratives :</span> <span class="value">{{ $patient->administrative_notes ?? 'Aucune' }}</span></p>
    </div>

    <div class="section">
        <h2>Sortie du Patient</h2>
        <p><span class="label">Date de sortie :</span> <span class="value">{{ $patient->discharge_date ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Diagnostic final :</span> <span class="value">{{ $patient->final_diagnosis ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Résumé du séjour :</span> <span class="value">{{ $patient->stay_summary ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Traitement prescrit :</span> <span class="value">
            @if($patient->prescribed_treatment)
                <ul>
                    @foreach($patient->prescribed_treatment as $treatment)
                        <li>{{ $treatment }}</li>
                    @endforeach
                </ul>
            @else
                Aucun
            @endif
        </span></p>
        <p><span class="label">Instructions patient :</span> <span class="value">{{ $patient->patient_instructions ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Prochain rendez-vous :</span> <span class="value">{{ $patient->follow_up_date ?? 'Non spécifié' }}</span></p>
        <p><span class="label">Médecin de suivi :</span> <span class="value">
            @php
                $followUpDoctor = \App\Models\User::where('identifier', $patient->follow_up_doctor_id)->first();
            @endphp
            {{ $followUpDoctor ? $followUpDoctor->name . ' (' . $followUpDoctor->identifier . ')' : 'Non spécifié' }}
        </span></p>
        <p><span class="label">Documents de sortie :</span> <span class="value">
            @if($patient->discharge_documents)
                @php
                    $dischargeDocs = [];
                    if ($patient->discharge_documents['rapport']) $dischargeDocs[] = 'Compte-rendu d\'hospitalisation';
                    if ($patient->discharge_documents['instructions']) $dischargeDocs[] = 'Instructions de soins';
                    if ($patient->discharge_documents['arret_travail']) $dischargeDocs[] = 'Arrêt de travail';
                    if ($patient->discharge_documents['certificat_medical']) $dischargeDocs[] = 'Certificat médical';
                @endphp
                {{ !empty($dischargeDocs) ? implode(', ', $dischargeDocs) : 'Aucun' }}
            @else
                Aucun
            @endif
        </span></p>
        <p><span class="label">Statut :</span> <span class="value">{{ $patient->discharge_confirmed ? 'Sorti' : 'Actif' }}</span></p>
    </div>
</body>
</html>