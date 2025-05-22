import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaFileDownload, FaUser, FaHeartbeat, FaHospital, FaFileInvoice, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const MedicalRecord = () => {
    const [patientData, setPatientData] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
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
                    email: response.data.email,
                    identifier: response.data.identifier,
                    role: response.data.role,
                    last_login: response.data.last_login,
                });
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('user_id', response.data.id);
            } catch (error) {
                setError('Erreur lors de la récupération des informations utilisateur');
                navigate('/login-staff');
            }
        };
        fetchUser();
    }, [navigate]);

    // Restreindre l'accès au rôle patient
    useEffect(() => {
        if (user && user.role !== 'patient') {
            setError('Accès réservé aux patients');
            navigate('/dashboard/' + user.role);
        }
    }, [user, navigate]);

    // Récupérer les données du patient
    useEffect(() => {
        const fetchPatientData = async () => {
            if (!user) return;
            try {
                const response = await axios.get('http://localhost:8000/api/patients/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const formattedData = {
                    ...response.data,
                    date_of_birth: response.data.date_of_birth ? response.data.date_of_birth.split('T')[0] : '',
                    admission_date: response.data.admission_date ? response.data.admission_date.replace(' ', 'T') : '',
                    discharge_date: response.data.discharge_date ? response.data.discharge_date.replace(' ', 'T') : '',
                    follow_up_date: response.data.follow_up_date ? response.data.follow_up_date.replace(' ', 'T') : '',
                };
                setPatientData(formattedData);
            } catch (error) {
                setError('Erreur lors de la récupération des données du patient');
            }
            setLoading(false);
        };

        if (user) {
            fetchPatientData();
        }
    }, [user]);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/patients/me/pdf', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dossier_medical_${patientData.identifier}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Erreur lors du téléchargement du dossier médical');
        }
        setIsDownloading(false);
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="fixed top-0 left-0 w-64 h-full">
                <Sidebar user={user} />
            </div>
            <div className="flex-1 p-4 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mon Dossier Médical</h1>
                    <Link
                        to="/dashboard/patient"
                        className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                        <FaArrowLeft className="mr-2" /> Retour
                    </Link>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Résumé du dossier médical */}
                {patientData ? (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Résumé du Dossier Médical</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <p className="text-gray-700"><strong>Nom Complet :</strong> {patientData.first_name} {patientData.last_name}</p>
                            <p className="text-gray-700"><strong>Date de Naissance :</strong> {patientData.date_of_birth || 'Non spécifié'}</p>
                            <p className="text-gray-700"><strong>Groupe Sanguin :</strong> {patientData.blood_group || 'Non spécifié'}</p>
                            <p className="text-gray-700">
                                <strong>Allergie Principale :</strong>{' '}
                                {patientData.allergies.medicaments.length > 0
                                    ? patientData.allergies.medicaments[0]
                                    : patientData.allergies.alimentaires.length > 0
                                    ? patientData.allergies.alimentaires[0]
                                    : patientData.allergies.autres.length > 0
                                    ? patientData.allergies.autres[0]
                                    : 'Aucune'}
                            </p>
                            <p className="text-gray-700">
                                <strong>Statut d'Admission :</strong>{' '}
                                {patientData.admission_date && !patientData.discharge_date
                                    ? 'En cours'
                                    : patientData.discharge_date
                                    ? 'Sorti'
                                    : 'Non admis'}
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                <FaEye className="mr-2" />
                                {showDetails ? 'Masquer les détails' : 'Voir les détails'}
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className={`flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 ${
                                    isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isDownloading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <FaFileDownload className="mr-2" />
                                )}
                                {isDownloading ? 'Téléchargement...' : 'Télécharger en PDF'}
                            </button>
                        </div>

                        {/* Détails du dossier médical */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                showDetails ? 'max-h-[3000px] opacity-100 mt-8' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="space-y-8">
                                {/* Informations Personnelles */}
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                                        <FaUser className="mr-2 text-blue-600" /> Informations Personnelles
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <p className="text-gray-700"><strong>Date de Naissance :</strong> {patientData.date_of_birth || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Sexe :</strong> {patientData.gender || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Nationalité :</strong> {patientData.nationality || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Adresse :</strong> {patientData.address || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Téléphone :</strong> {patientData.phone || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Email :</strong> {patientData.email || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Situation Matrimoniale :</strong> {patientData.marital_status || 'Non spécifié'}</p>
                                        <p className="text-gray-700">
                                            <strong>Contact d'Urgence :</strong>{' '}
                                            {patientData.emergency_contact_name || 'Non spécifié'} (
                                            {patientData.emergency_contact_relation}, {patientData.emergency_contact_phone})
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Document :</strong> {patientData.document_type}{' '}
                                            {patientData.document_number || 'Non spécifié'}
                                        </p>
                                    </div>
                                </div>

                                {/* Informations Médicales */}
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                                        <FaHeartbeat className="mr-2 text-blue-600" /> Informations Médicales
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <p className="text-gray-700"><strong>Groupe Sanguin :</strong> {patientData.blood_group || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Taille :</strong> {patientData.height_cm || 'Non spécifié'} cm</p>
                                        <p className="text-gray-700"><strong>Poids :</strong> {patientData.weight_kg || 'Non spécifié'} kg</p>
                                        <p className="text-gray-700">
                                            <strong>Allergies :</strong>
                                            {patientData.allergies.medicaments.length ||
                                            patientData.allergies.alimentaires.length ||
                                            patientData.allergies.autres.length ? (
                                                <ul className="list-disc ml-5 text-gray-700">
                                                    {patientData.allergies.medicaments.map((a, i) => (
                                                        <li key={i}>Médicament: {a}</li>
                                                    ))}
                                                    {patientData.allergies.alimentaires.map((a, i) => (
                                                        <li key={i}>Alimentaire: {a}</li>
                                                    ))}
                                                    {patientData.allergies.autres.map((a, i) => (
                                                        <li key={i}>Autre: {a}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                ' Aucune'
                                            )}
                                        </p>
                                        <p className="text-gray-700"><strong>Détails des Allergies :</strong> {patientData.allergy_details || 'Non spécifié'}</p>
                                        <p className="text-gray-700">
                                            <strong>Signes Vitaux :</strong> Température: {patientData.vital_signs.temperature || 'N/A'},
                                            Tension: {patientData.vital_signs.tension || 'N/A'}, Pouls:{' '}
                                            {patientData.vital_signs.pouls || 'N/A'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Antécédents Médicaux :</strong>
                                            {Object.entries(patientData.medical_history)
                                                .filter(([k, v]) => v && k !== 'autres')
                                                .map(([k]) => k)
                                                .join(', ') || 'Aucun'}
                                            {patientData.medical_history.autres ? `, ${patientData.medical_history.autres}` : ''}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Antécédents Chirurgicaux :</strong>{' '}
                                            {patientData.surgical_history.join(', ') || 'Aucun'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Traitements en Cours :</strong>{' '}
                                            {patientData.current_treatments.join(', ') || 'Aucun'}
                                        </p>
                                    </div>
                                </div>

                                {/* Admission */}
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                                        <FaHospital className="mr-2 text-blue-600" /> Admission
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <p className="text-gray-700"><strong>Date d'Admission :</strong> {patientData.admission_date || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Type d'Admission :</strong> {patientData.admission_type || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Motif :</strong> {patientData.admission_reason || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Service :</strong> {patientData.service || 'Non spécifié'}</p>
                                        <p className="text-gray-700"><strong>Médecin :</strong> {patientData.doctor_id || 'Non spécifié'}</p>
                                        <p className="text-gray-700">
                                            <strong>Chambre :</strong> {patientData.room} ({patientData.bed},{' '}
                                            {patientData.room_type})
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Équipements Spéciaux :</strong>
                                            {Object.entries(patientData.special_equipment)
                                                .filter(([k, v]) => v && k !== 'autre')
                                                .map(([k]) => k)
                                                .join(', ') || 'Aucun'}
                                            {patientData.special_equipment.autre
                                                ? `, ${patientData.special_equipment.autre}`
                                                : ''}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Précautions :</strong>
                                            {Object.entries(patientData.precautions)
                                                .filter(([k, v]) => v && k !== 'notes')
                                                .map(([k]) => k)
                                                .join(', ') || 'Aucune'}
                                            {patientData.precautions.notes ? `, ${patientData.precautions.notes}` : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Gestion Administrative */}
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                                        <FaFileInvoice className="mr-2 text-blue-600" /> Gestion Administrative
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <p className="text-gray-700">
                                            <strong>Type de Prise en Charge :</strong>{' '}
                                            {patientData.payment_type || 'Non spécifié'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Assurance :</strong> {patientData.insurance_details.compagnie} (
                                            {patientData.insurance_details.titulaire})
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Couverture :</strong>{' '}
                                            {patientData.insurance_details.couverture || 'Non spécifié'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Documents :</strong>
                                            {Object.entries(patientData.documents)
                                                .filter(([k, v]) => v && k !== 'autres')
                                                .map(([k]) => k)
                                                .join(', ') || 'Aucun'}
                                            {patientData.documents.autres ? `, ${patientData.documents.autres}` : ''}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Durée Estimée :</strong>{' '}
                                            {patientData.estimated_stay_days || 'Non spécifié'} jours
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Coût Journalier :</strong> {patientData.daily_cost || 'Non spécifié'}
                                        </p>
                                        <p className="text-gray-700"><strong>Coût Total :</strong> {patientData.total_cost || 'Non spécifié'}</p>
                                        <p className="text-gray-700">
                                            <strong>Modalités de Paiement :</strong>{' '}
                                            {patientData.payment_terms || 'Non spécifié'}
                                        </p>
                                        <p className="text-gray-700"><strong>Notes :</strong> {patientData.administrative_notes || 'Non spécifié'}</p>
                                    </div>
                                </div>

                                {/* Sortie */}
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                                        <FaSignOutAlt className="mr-2 text-blue-600" /> Sortie
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <p className="text-gray-700"><strong>Date de Sortie :</strong> {patientData.discharge_date || 'Non spécifié'}</p>
                                        <p className="text-gray-700">
                                            <strong>Diagnostic Final :</strong>{' '}
                                            {patientData.final_diagnosis || 'Non spécifié'}
                                        </p>
                                        <p className="text-gray-700"><strong>Résumé du Séjour :</strong> {patientData.stay_summary || 'Non spécifié'}</p>
                                        <p className="text-gray-700">
                                            <strong>Traitement Prescrit :</strong>{' '}
                                            {patientData.prescribed_treatment.join(', ') || 'Aucun'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Instructions :</strong>{' '}
                                            {patientData.patient_instructions || 'Non spécifié'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Prochain Rendez-vous :</strong>{' '}
                                            {patientData.follow_up_date || 'Non spécifié'} (
                                            {patientData.follow_up_doctor_id})
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Documents de Sortie :</strong>
                                            {Object.entries(patientData.discharge_documents)
                                                .filter(([k, v]) => v)
                                                .map(([k]) => k)
                                                .join(', ') || 'Aucun'}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Sortie Confirmée :</strong>{' '}
                                            {patientData.discharge_confirmed ? 'Oui' : 'Non'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <p className="text-gray-600">Aucun dossier médical trouvé pour cet utilisateur.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalRecord; 