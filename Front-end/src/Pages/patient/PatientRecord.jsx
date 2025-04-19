import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const PatientRecord = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState({});
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/patient/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatient(response.data);
            } catch (err) {
                console.error('Erreur lors du chargement du dossier médical', err);
            }
        };
        fetchPatient();
    }, [id]);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Dossier médical - ${patient.nom}`, 10, 10);
        doc.setFontSize(12);
        let y = 20;

        const addSection = (title, data) => {
            doc.text(title, 10, y);
            y += 10;
            for (const [key, value] of Object.entries(data)) {
                if (value) {
                    doc.text(`${key}: ${value}`, 10, y);
                    y += 10;
                }
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
            }
            y += 10;
        };

        addSection('Informations personnelles', {
            'Nom': patient.nom,
            'Prénom': patient.prenom,
            'Date de naissance': patient.date_de_naissance,
            'Sexe': patient.sexe,
            'Nationalité': patient.nationalite,
            'Adresse': patient.adresse,
            'Téléphone': patient.telephone,
            'Email': patient.email,
            'Situation matrimoniale': patient.situation_matrimoniale,
        });

        addSection('Contact d’urgence', {
            'Nom': patient.contact_urgence,
            'Téléphone': patient.telephone_urgence,
            'Type de document': patient.type_document,
            'Numéro de document': patient.numero_document,
        });

        addSection('Informations médicales', {
            'Groupe sanguin': patient.groupe_sanguin,
            'Allergies': patient.allergies,
            'Taille': patient.taille,
            'Poids': patient.poids,
            'Température': patient.temperature,
            'Tension artérielle': patient.tension_avc,
            'Pouls': patient.pouls,
            'Antécédents médicaux': patient.antecedents_medicaux,
            'Antécédents chirurgicaux': patient.antecedents_chirurgicaux,
            'Traitement en cours': patient.traitement_en_cours,
        });

        addSection('Admission', {
            'Date d’admission': patient.date_admission,
            'Heure d’admission': patient.heure_admission,
            'Type d’admission': patient.type_admission,
            'Motif d’admission': patient.motif_admission,
            'Service': patient.service,
            'Médecin traitant': patient.medecin_traitant,
            'Chambre': patient.chambre,
            'Lit': patient.lit,
            'Type de chambre': patient.type_chambre,
            'Équipements requis': patient.equipements_requis,
            'Oxygène': patient.oxygen,
            'Précaution particulière': patient.precaution_particuliere,
        });

        addSection('Informations administratives', {
            'Type de paiement': patient.type_paiement,
            'Documents fournis': patient.documents_fournis,
            'Numéro d’assurance': patient.numero_assurance,
            'Numéro de police': patient.numero_police,
            'Titre d’assurance': patient.titre_assurance,
            'Coût journalier': patient.cout_journalier,
            'Durée d’hospitalisation': patient.duree_hospitalisation,
            'Coût total estimé': patient.cout_total_estime,
            'Couverture d’assurance': patient.couverture_assurance,
            'Modalité de paiement': patient.modalite_paiement,
            'Relation avec le patient': patient.relation_patient,
            'Précaution particulière': patient.precaution_particuliere_admin,
        });

        addSection('Sortie', {
            'Date de sortie': patient.date_sortie,
            'Heure de sortie': patient.heure_sortie,
            'Type de sortie': patient.type_sortie,
            'Diagnostic final': patient.diagnostic_final,
            'Évolution de la santé': patient.evolution_sante,
            'Séjour et amélioration': patient.sejour_amelioration,
            'Date du prochain rendez-vous': patient.date_prochain_rdv,
            'Médecin du rendez-vous': patient.medecin_rdv,
            'Traitement prescrit': patient.traitement_prescrit,
            'Instructions au patient': patient.instruction_patient,
            'Documents de sortie': patient.documents_sortie,
            'Besoins de soins à domicile': patient.besoins_soins,
        });

        doc.save(`dossier_medical_${patient.nom}.pdf`);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />
            <div className="flex-1 ml-0 md:ml-64 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Dossier médical - {patient.nom} {patient.prenom}</h1>
                    <button onClick={exportToPDF} className="text-blue-600 flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 2H6.414A2 2 0 004 4v12a2 2 0 002 2h7.172a2 2 0 001.414-.586l3.828-3.828A2 2 0 0020 12V4a2 2 0 00-2-2h-4.414zM16 14h-2a2 2 0 01-2 2v2h-2V4h6v10zM6 16h4v-2H6v2zm0-4h8v-2H6v2zm0-4h8V6H6v2z" />
                        </svg> Exporter en PDF
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    {/* Informations personnelles */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Informations personnelles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Nom :</strong> {patient.nom || 'N/A'}</p>
                            <p><strong>Prénom :</strong> {patient.prenom || 'N/A'}</p>
                            <p><strong>Date de naissance :</strong> {patient.date_de_naissance || 'N/A'}</p>
                            <p><strong>Sexe :</strong> {patient.sexe || 'N/A'}</p>
                            <p><strong>Nationalité :</strong> {patient.nationalite || 'N/A'}</p>
                            <p><strong>Adresse :</strong> {patient.adresse || 'N/A'}</p>
                            <p><strong>Téléphone :</strong> {patient.telephone || 'N/A'}</p>
                            <p><strong>Email :</strong> {patient.email || 'N/A'}</p>
                            <p><strong>Situation matrimoniale :</strong> {patient.situation_matrimoniale || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Contact d’urgence */}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Contact d’urgence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Nom :</strong> {patient.contact_urgence || 'N/A'}</p>
                            <p><strong>Téléphone :</strong> {patient.telephone_urgence || 'N/A'}</p>
                            <p><strong>Type de document :</strong> {patient.type_document || 'N/A'}</p>
                            <p><strong>Numéro de document :</strong> {patient.numero_document || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Informations médicales */}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Informations médicales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Groupe sanguin :</strong> {patient.groupe_sanguin || 'N/A'}</p>
                            <p><strong>Allergies :</strong> {patient.allergies || 'N/A'}</p>
                            <p><strong>Taille :</strong> {patient.taille || 'N/A'} cm</p>
                            <p><strong>Poids :</strong> {patient.poids || 'N/A'} kg</p>
                            <p><strong>Température :</strong> {patient.temperature || 'N/A'} °C</p>
                            <p><strong>Tension artérielle :</strong> {patient.tension_avc || 'N/A'} mmHg</p>
                            <p><strong>Pouls :</strong> {patient.pouls || 'N/A'} bpm</p>
                            <p><strong>Antécédents médicaux :</strong> {patient.antecedents_medicaux || 'N/A'}</p>
                            <p><strong>Antécédents chirurgicaux :</strong> {patient.antecedents_chirurgicaux || 'N/A'}</p>
                            <p><strong>Traitement en cours :</strong> {patient.traitement_en_cours || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Admission */}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Admission</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Date d’admission :</strong> {patient.date_admission || 'N/A'}</p>
                            <p><strong>Heure d’admission :</strong> {patient.heure_admission || 'N/A'}</p>
                            <p><strong>Type d’admission :</strong> {patient.type_admission || 'N/A'}</p>
                            <p><strong>Motif d’admission :</strong> {patient.motif_admission || 'N/A'}</p>
                            <p><strong>Service :</strong> {patient.service || 'N/A'}</p>
                            <p><strong>Médecin traitant :</strong> {patient.medecin_traitant || 'N/A'}</p>
                            <p><strong>Chambre :</strong> {patient.chambre || 'N/A'}</p>
                            <p><strong>Lit :</strong> {patient.lit || 'N/A'}</p>
                            <p><strong>Type de chambre :</strong> {patient.type_chambre || 'N/A'}</p>
                            <p><strong>Équipements requis :</strong> {patient.equipements_requis || 'N/A'}</p>
                            <p><strong>Oxygène :</strong> {patient.oxygen || 'N/A'}</p>
                            <p><strong>Précaution particulière :</strong> {patient.precaution_particuliere || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Informations administratives */}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Informations administratives</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Type de paiement :</strong> {patient.type_paiement || 'N/A'}</p>
                            <p><strong>Documents fournis :</strong> {patient.documents_fournis || 'N/A'}</p>
                            <p><strong>Numéro d’assurance :</strong> {patient.numero_assurance || 'N/A'}</p>
                            <p><strong>Numéro de police :</strong> {patient.numero_police || 'N/A'}</p>
                            <p><strong>Titre d’assurance :</strong> {patient.titre_assurance || 'N/A'}</p>
                            <p><strong>Coût journalier :</strong> {patient.cout_journalier || 'N/A'} FCFA</p>
                            <p><strong>Durée d’hospitalisation :</strong> {patient.duree_hospitalisation || 'N/A'} jours</p>
                            <p><strong>Coût total estimé :</strong> {patient.cout_total_estime || 'N/A'} FCFA</p>
                            <p><strong>Couverture d’assurance :</strong> {patient.couverture_assurance || 'N/A'}</p>
                            <p><strong>Modalité de paiement :</strong> {patient.modalite_paiement || 'N/A'}</p>
                            <p><strong>Relation avec le patient :</strong> {patient.relation_patient || 'N/A'}</p>
                            <p><strong>Précaution particulière :</strong> {patient.precaution_particuliere_admin || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Sortie */}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Sortie</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Date de sortie :</strong> {patient.date_sortie || 'N/A'}</p>
                            <p><strong>Heure de sortie :</strong> {patient.heure_sortie || 'N/A'}</p>
                            <p><strong>Type de sortie :</strong> {patient.type_sortie || 'N/A'}</p>
                            <p><strong>Diagnostic final :</strong> {patient.diagnostic_final || 'N/A'}</p>
                            <p><strong>Évolution de la santé :</strong> {patient.evolution_sante || 'N/A'}</p>
                            <p><strong>Séjour et amélioration :</strong> {patient.sejour_amelioration || 'N/A'}</p>
                            <p><strong>Date du prochain rendez-vous :</strong> {patient.date_prochain_rdv || 'N/A'}</p>
                            <p><strong>Médecin du rendez-vous :</strong> {patient.medecin_rdv || 'N/A'}</p>
                            <p><strong>Traitement prescrit :</strong> {patient.traitement_prescrit || 'N/A'}</p>
                            <p><strong>Instructions au patient :</strong> {patient.instruction_patient || 'N/A'}</p>
                            <p><strong>Documents de sortie :</strong> {patient.documents_sortie || 'N/A'}</p>
                            <p><strong>Besoins de soins à domicile :</strong> {patient.besoins_soins || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
export default PatientRecord;