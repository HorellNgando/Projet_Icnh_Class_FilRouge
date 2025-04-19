import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const MedecinDashboard = () => {
    const [medecinInfo, setMedecinInfo] = useState({});
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [lastLogin, setLastLogin] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const medecinResponse = await axios.get('http://localhost:8000/api/user/profile', { headers });
                setMedecinInfo(medecinResponse.data);

                const patientsResponse = await axios.get('http://localhost:8000/api/medecin/patients', { headers });
                setPatients(patientsResponse.data);

                const appointmentsResponse = await axios.get('http://localhost:8000/api/medecin/appointments', { headers });
                setAppointments(appointmentsResponse.data);

                const lastLoginResponse = await axios.get('http://localhost:8000/api/medecin/last-login', { headers });
                setLastLogin(lastLoginResponse.data.last_login);
            } catch (err) {
                console.error('Erreur lors du chargement des données', err);
            }
        };
        fetchData();
    }, []);

    const handleProfileUpdate = () => {
        navigate('/medecin/profile');
    };

    const exportPatientRecord = async (patientId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/patient/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const patient = response.data;

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(`Dossier médical - ${patient.nom} ${patient.prenom}`, 10, 10);
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

            doc.save(`dossier_medical_${patient.nom}_${patient.prenom}.pdf`);
        } catch (err) {
            console.error('Erreur lors de l’exportation du dossier', err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role="medecin" />
            <div className="flex-1 ml-0 md:ml-64 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tableau de bord - Médecin</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600 text-sm">Dernière connexion: {lastLogin}</span>
                        <span className="text-gray-600">ID: {medecinInfo.id_utilisateur || 'N/A'}</span>
                        <span>{medecinInfo.nom} {medecinInfo.prenom}</span>
                        <button onClick={handleProfileUpdate} className="text-blue-600">
                            Modifier le profil
                        </button>
                    </div>
                </div>

                <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                    <h2 className="text-xl font-semibold">Bienvenue, Dr {medecinInfo.nom} {medecinInfo.prenom}</h2>
                    <p>Voici un aperçu de vos patients et rendez-vous.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Nombre de patients</h3>
                        <p className="text-2xl font-bold">{patients.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Rendez-vous aujourd’hui</h3>
                        <p className="text-2xl font-bold">{appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Service</h3>
                        <p className="text-2xl font-bold">{medecinInfo.service || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="text-lg font-semibold mb-2">Mes patients</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Nom</th>
                                <th className="p-2 text-left">Date d’admission</th>
                                <th className="p-2 text-left">Statut</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{patient.id}</td>
                                    <td className="p-2">{patient.nom}</td>
                                    <td className="p-2">{patient.date_admission}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded ${patient.statut === 'En cours' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {patient.statut}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <Link to={`/patient/${patient.id}`} className="text-blue-600 mr-2">Voir dossier</Link>
                                        <button onClick={() => exportPatientRecord(patient.id)} className="text-blue-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13.586 2H6.414A2 2 0 004 4v12a2 2 0 002 2h7.172a2 2 0 001.414-.586l3.828-3.828A2 2 0 0020 12V4a2 2 0 00-2-2h-4.414zM16 14h-2a2 2 0 01-2 2v2h-2V4h6v10zM6 16h4v-2H6v2zm0-4h8v-2H6v2zm0-4h8V6H6v2z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Mes rendez-vous</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-left">Patient</th>
                                <th className="p-2 text-left">Service</th>
                                <th className="p-2 text-left">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{appointment.date}</td>
                                    <td className="p-2">{appointment.patient}</td>
                                    <td className="p-2">{appointment.service}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded ${appointment.statut === 'Confirmé' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {appointment.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MedecinDashboard;