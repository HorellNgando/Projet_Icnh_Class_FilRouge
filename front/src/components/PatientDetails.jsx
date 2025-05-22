import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaFileMedical } from 'react-icons/fa';

const PatientDetails = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('personal');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Récupérer les informations utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUser({
                    id: response.data.id,
                    name: response.data.name,
                    surname: response.data.surname,
                    identifier: response.data.identifier,
                    role: response.data.role,
                });
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('user_id', response.data.id);
            } catch (error) {
                setError('Erreur lors de la récupération du rôle');
                navigate('/login-staff');
            }
        };
        fetchUser();
    }, [navigate]);

    // Vérifier les autorisations pour le patient
    useEffect(() => {
        if (user?.role === 'patient' && user?.id && parseInt(id) !== parseInt(user.id)) {
            setError('Accès non autorisé : vous ne pouvez voir que vos propres informations.');
            navigate('/dashboard/patients');
        }
    }, [user, id, navigate]);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/patients/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setPatient(response.data);
                setError('');
            } catch (error) {
                setError(error.response?.data?.message || 'Erreur lors du chargement des détails');
            }
        };
        if (user) {
            fetchPatient();
        }
    }, [id, user]);

    const handleDownloadMedicalRecord = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/patients/${id}/medical-record/pdf`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dossier_medical_${patient.identifier}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Erreur lors du téléchargement du dossier médical');
        }
    };

    // Fonction pour formater les objets JSON
    const formatObject = (obj, labels = {}) => {
        if (!obj) return 'Aucun';
        const entries = Object.entries(obj).filter(([key, value]) => value === true || (typeof value === 'string' && value.trim()));
        if (!entries.length) return 'Aucun';
        return entries.map(([key, value]) => labels[key] || key).join(', ');
    };

    // Labels pour les champs à choix multiples
    const medicalHistoryLabels = {
        diabete: 'Diabète',
        hypertension: 'Hypertension',
        cancer: 'Cancer',
        respiratoire: 'Problèmes Respiratoires',
        cardiaque: 'Problèmes Cardiaques',
        autres: patient?.medical_history?.autres || '',
    };

    const equipmentLabels = {
        oxygene: 'Oxygène',
        aspiration: 'Aspiration',
        ventilation: 'Ventilation',
        pompe_perfusion: 'Pompe à Perfusion',
        moniteur_cardiaque: 'Moniteur Cardiaque',
        autre: patient?.special_equipment?.autre || '',
    };

    const precautionsLabels = {
        chute: 'Risque de Chute',
        infection: 'Risque d\'Infection',
        regime_special: 'Régime Spécial',
        notes: patient?.precautions?.notes || '',
    };

    const documentsLabels = {
        consentement: 'Formulaire de Consentement',
        reference: 'Lettre de Référence',
        autres: patient?.documents?.autres || '',
    };

    const dischargeDocumentsLabels = {
        rapport: 'Compte-rendu',
        instructions: 'Instructions de Soins',
        arret_travail: 'Arrêt de Travail',
        certificat_medical: 'Certificat Médical',
    };

    if (!user || !patient) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    // Définir les onglets visibles selon le rôle
    const tabs = [
        { id: 'personal', label: 'Personnelles', roles: ['admin', 'medecin', 'infirmier', 'stagiaire', 'secretaire', 'patient'] },
        { id: 'medical', label: 'Médicales', roles: ['admin', 'medecin', 'infirmier', 'stagiaire', 'patient'] },
        { id: 'admission', label: 'Admission', roles: ['admin', 'medecin', 'infirmier', 'stagiaire', 'secretaire', 'patient'] },
        { id: 'administrative', label: 'Administratif', roles: ['admin', 'secretaire'] },
        { id: 'discharge', label: 'Sortie', roles: ['admin', 'medecin', 'infirmier', 'stagiaire', 'patient'] },
    ].filter((tab) => tab.roles.includes(user.role));

    return (
        <div className="flex">
            <div className="flex-1 p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {patient.first_name} {patient.last_name}
                            </h1>
                            <p className="text-gray-600 font-mono text-sm">ID: {patient.identifier}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to={user.role === 'patient' ? '/dashboard/patients' : '/dashboard/admin/patients'}
                                className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200 border border-gray-200 shadow-sm"
                            >
                                <FaArrowLeft className="mr-2" /> Retour
                            </Link>
                            {(user.role === 'admin' || user.role === 'medecin' || user.role === 'secretaire') && (
                                <Link
                                    to={`/dashboard/admin/patients/edit/${id}`}
                                    className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-sm"
                                >
                                    <FaEdit className="mr-2" /> Modifier
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'infirmier' || user.role === 'patient') && (
                                <button
                                    onClick={handleDownloadMedicalRecord}
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                                >
                                    <FaFileMedical className="mr-2" /> Télécharger Dossier
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Onglets */}
                        {tabs.length > 0 && (
                            <div className="border-b border-gray-200 bg-gray-50">
                                <nav className="flex space-x-1 p-4" aria-label="Tabs">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Contenu des onglets */}
                        <div className="p-6">
                            {activeTab === 'personal' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Date de naissance</p>
                                            <p className="font-medium">{patient.date_of_birth || 'Non spécifié'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Genre</p>
                                            <p className="font-medium capitalize">{patient.gender || 'Non spécifié'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Nationalité</p>
                                            <p className="font-medium">{patient.nationality || 'Non spécifié'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Adresse</p>
                                            <p className="font-medium">{patient.address || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                                            <p className="font-medium">{patient.phone || 'Non spécifié'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Email</p>
                                            <p className="font-medium">{patient.email || 'Non spécifié'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Situation familiale</p>
                                            <p className="font-medium capitalize">{patient.marital_status || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'medical' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Antécédents Médicaux</h4>
                                            <p className="text-gray-700">{formatObject(patient.medical_history, medicalHistoryLabels)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Allergies</h4>
                                            <p className="text-gray-700">{formatObject(patient.allergies)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-3">Signes Vitaux</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Température</p>
                                                <p className="font-medium">{patient.vital_signs?.temperature || 'Non spécifié'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Tension</p>
                                                <p className="font-medium">{patient.vital_signs?.tension || 'Non spécifié'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Pouls</p>
                                                <p className="font-medium">{patient.vital_signs?.pouls || 'Non spécifié'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'admission' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Informations d'Admission</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Date d'admission</p>
                                                    <p className="font-medium">{patient.admission_date || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Type d'admission</p>
                                                    <p className="font-medium capitalize">{patient.admission_type || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Motif d'admission</p>
                                                    <p className="font-medium">{patient.admission_reason || 'Non spécifié'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Affectation</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Service</p>
                                                    <p className="font-medium">{patient.service || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Médecin traitant</p>
                                                    <p className="font-medium">{patient.doctor_name || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Chambre</p>
                                                    <p className="font-medium">{patient.room || 'Non spécifié'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'administrative' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Informations de Paiement</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Type de paiement</p>
                                                    <p className="font-medium capitalize">{patient.payment_type || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Conditions de paiement</p>
                                                    <p className="font-medium capitalize">{patient.payment_terms || 'Non spécifié'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Documents</h4>
                                            <p className="text-gray-700">{formatObject(patient.documents, documentsLabels)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'discharge' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Informations de Sortie</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Date de sortie</p>
                                                    <p className="font-medium">{patient.discharge_date || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Diagnostic final</p>
                                                    <p className="font-medium">{patient.final_diagnosis || 'Non spécifié'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Résumé du séjour</p>
                                                    <p className="font-medium">{patient.stay_summary || 'Non spécifié'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-3">Documents de Sortie</h4>
                                            <p className="text-gray-700">{formatObject(patient.discharge_documents, dischargeDocumentsLabels)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;