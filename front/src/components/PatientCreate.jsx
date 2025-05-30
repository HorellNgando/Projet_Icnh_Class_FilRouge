import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaHeartbeat, FaHospital, FaFileInvoice, FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';

const PatientCreate = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        nationality: '',
        address: '',
        phone: '',
        email: '',
        marital_status: '',
        emergency_contact_name: '',
        emergency_contact_relation: '',
        emergency_contact_phone: '',
        document_type: '',
        document_number: '',
        blood_group: '',
        height_cm: '',
        weight_kg: '',
        allergies: { medicaments: [], alimentaires: [], autres: [] },
        allergy_details: '',
        vital_signs: { temperature: '', tension: '', pouls: '' },
        medical_history: {
            diabete: false,
            hypertension: false,
            cancer: false,
            respiratoire: false,
            cardiaque: false,
            autres: '',
        },
        surgical_history: [],
        current_treatments: [],
        admission_date: '',
        admission_type: '',
        admission_reason: '',
        service: '',
        doctor_id: '',
        room: '',
        bed: '',
        room_type: '',
        special_equipment: {
            oxygene: false,
            aspiration: false,
            ventilation: false,
            pompe_perfusion: false,
            moniteur_cardiaque: false,
            autre: '',
        },
        precautions: {
            chute: false,
            infection: false,
            regime_special: false,
            notes: '',
        },
        payment_type: '',
        insurance_details: { compagnie: '', titulaire: '', couverture: '' },
        documents: {
            consentement: false,
            reference: false,
            autres: '',
        },
        estimated_stay_days: '',
        daily_cost: '',
        total_cost: '',
        payment_terms: '',
        administrative_notes: '',
        discharge_date: '',
        final_diagnosis: '',
        stay_summary: '',
        prescribed_treatment: [],
        patient_instructions: '',
        follow_up_date: '',
        follow_up_doctor_id: '',
        discharge_documents: {
            rapport: false,
            instructions: false,
            arret_travail: false,
            certificat_medical: false,
        },
        discharge_confirmed: false,
        status: 'ongoing', // Added status field
    });
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
                setError('Erreur lors de la récupération des informations utilisateur');
                navigate('/login-staff');
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/doctors/active', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setDoctors(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération des médecins');
            }
        };
        if (user) {
            fetchDoctors();
        }
    }, [user]);

    useEffect(() => {
        if (user && !['admin', 'infirmier', 'secretaire'].includes(user.role)) {
            setError('Accès non autorisé');
            navigate('/dashboard/admin/patients');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: { ...prev[name], [e.target.dataset.key]: checked },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayChange = (e, arrayName) => {
        if (e.key !== 'Enter') return;
        const value = e.target.value.trim();
        if (!value) return;
        setFormData((prev) => ({
            ...prev,
            [arrayName]: [...prev[arrayName], value],
        }));
        e.target.value = '';
    };

    const handleNestedChange = (e, parentKey, childKey) => {
        setFormData((prev) => ({
            ...prev,
            [parentKey]: { ...prev[parentKey], [childKey]: e.target.value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update status based on discharge_confirmed
            const updatedFormData = {
                ...formData,
                status: formData.discharge_confirmed ? 'discharged' : 'ongoing',
            };
            const response = await axios.post('http://localhost:8000/api/patients', updatedFormData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            navigate(`/dashboard/admin/patients/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de l\'ajout du patient');
        }
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <Link
                            to="/dashboard/admin/patients"
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2"
                            aria-label="Retour"
                        >
                            <FaArrowLeft className="mr-2" /> Enregistrement Patient
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Formulaire d'admission et de suivi du patient
                        </h1>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex space-x-4 mb-6 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={`flex items-center px-4 py-2 rounded-t-lg ${step === 1 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FaUser className="mr-2" /> Informations personnelles
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className={`flex items-center px-4 py-2 rounded-t-lg ${step === 2 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FaHeartbeat className="mr-2" /> Informations médicales
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(3)}
                            className={`flex items-center px-4 py-2 rounded-t-lg ${step === 3 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FaHospital className="mr-2" /> Admission
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(4)}
                            className={`flex items-center px-4 py-2 rounded-t-lg ${step === 4 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FaFileInvoice className="mr-2" /> Gestion administrative
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(5)}
                            className={`flex items-center px-4 py-2 rounded-t-lg ${step === 5 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FaSignOutAlt className="mr-2" /> Sortie du patient
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Informations personnelles</h2>
                                <p className="text-gray-600 mb-4">Saisissez les informations d'identification du patient</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Nom</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            placeholder="Nom du patient"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Prénom</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            placeholder="Prénom du patient"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Date de naissance</label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Sexe</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="male">Homme</option>
                                            <option value="female">Femme</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Nationalité</label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nationalité du patient"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Adresse</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Adresse complète"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Téléphone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Numéro du patient"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Email du patient"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Situation Matrimoniale</label>
                                        <select
                                            name="marital_status"
                                            value={formData.marital_status}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="single">Célibataire</option>
                                            <option value="married">Marié(e)</option>
                                            <option value="divorced">Divorcé(e)</option>
                                            <option value="widowed">Veuf/Veuve</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Nom du Contact d'Urgence</label>
                                        <input
                                            type="text"
                                            name="emergency_contact_name"
                                            value={formData.emergency_contact_name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nom et prénom"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Relation avec le Contact</label>
                                        <input
                                            type="text"
                                            name="emergency_contact_relation"
                                            value={formData.emergency_contact_relation}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Relation avec le patient"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Téléphone du Contact</label>
                                        <input
                                            type="text"
                                            name="emergency_contact_phone"
                                            value={formData.emergency_contact_phone}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Téléphone"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Type de Document</label>
                                        <select
                                            name="document_type"
                                            value={formData.document_type}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="carte_identite">Carte d'Identité</option>
                                            <option value="passeport">Passeport</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Numéro du Document</label>
                                        <input
                                            type="text"
                                            name="document_number"
                                            value={formData.document_number}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Numéro du document"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
                                    >
                                        Continuer
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Informations médicales</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Groupe Sanguin</label>
                                        <select
                                            name="blood_group"
                                            value={formData.blood_group}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Taille (cm)</label>
                                        <input
                                            type="number"
                                            name="height_cm"
                                            value={formData.height_cm}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className= "block text-gray-700">Poids (kg)</label>
                                        <input
                                            type="number"
                                            name="weight_kg"
                                            value={formData.weight_kg}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Allergies Médicamenteuses</label>
                                        <input
                                            type="text"
                                            onKeyDown={(e) => handleArrayChange(e, 'allergies.medicaments')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ul className="mt-2">
                                            {formData.allergies.medicaments.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Allergies Alimentaires</label>
                                        <input
                                            type="text"
                                            onKeyDown={(e) => handleArrayChange(e, 'allergies.alimentaires')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ul className="mt-2">
                                            {formData.allergies.alimentaires.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Autres Allergies</label>
                                        <input
                                            type="text"
                                            onKeyDown={(e) => handleArrayChange(e, 'allergies.autres')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ul className="mt-2">
                                            {formData.allergies.autres.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Détails des Allergies</label>
                                        <textarea
                                            name="allergy_details"
                                            value={formData.allergy_details}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Température (°C)</label>
                                        <input
                                            type="text"
                                            name="vital_signs.temperature"
                                            value={formData.vital_signs.temperature}
                                            onChange={(e) => handleNestedChange(e, 'vital_signs', 'temperature')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Tension Artérielle</label>
                                        <input
                                            type="text"
                                            name="vital_signs.tension"
                                            value={formData.vital_signs.tension}
                                            onChange={(e) => handleNestedChange(e, 'vital_signs', 'tension')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Pouls</label>
                                        <input
                                            type="text"
                                            name="vital_signs.pouls"
                                            value={formData.vital_signs.pouls}
                                            onChange={(e) => handleNestedChange(e, 'vital_signs', 'pouls')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Antécédents Médicaux</label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="diabete"
                                                name="medical_history"
                                                checked={formData.medical_history.diabete}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Diabète
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="hypertension"
                                                name="medical_history"
                                                checked={formData.medical_history.hypertension}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Hypertension
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="cancer"
                                                name="medical_history"
                                                checked={formData.medical_history.cancer}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Cancer
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="respiratoire"
                                                name="medical_history"
                                                checked={formData.medical_history.respiratoire}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Problèmes Respiratoires
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="cardiaque"
                                                name="medical_history"
                                                checked={formData.medical_history.cardiaque}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Problèmes Cardiaques
                                        </label>
                                        <textarea
                                            name="medical_history.autres"
                                            value={formData.medical_history.autres}
                                            onChange={(e) => handleNestedChange(e, 'medical_history', 'autres')}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Autres antécédents"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Antécédents Chirurgicaux</label>
                                        <input
                                            type="text"
                                            onKeyDown={(e) => handleArrayChange(e, 'surgical_history')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ul className="mt-2">
                                            {formData.surgical_history.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Traitements en Cours</label>
                                        <input
                                            type="text"
                                            onKeyDown={(e) => handleArrayChange(e, 'current_treatments')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ul className="mt-2">
                                            {formData.current_treatments.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
                                    >
                                        Continuer
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Admission</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Date et Heure d'Admission</label>
                                        <input
                                            type="datetime-local"
                                            name="admission_date"
                                            value={formData.admission_date}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Type d'Admission</label>
                                        <select
                                            name="admission_type"
                                            value={formData.admission_type}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="programmee">Programmée</option>
                                            <option value="urgence">Urgence</option>
                                            <option value="transfert">Transfert</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Motif d'Admission</label>
                                        <textarea
                                            name="admission_reason"
                                            value={formData.admission_reason}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Service</label>
                                        <input
                                            type="text"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Médecin Responsable</label>
                                        <select
                                            name="doctor_id"
                                            value={formData.doctor_id}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner un médecin</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.identifier} value={doctor.identifier}>
                                                    {doctor.name} ({doctor.identifier})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Chambre</label>
                                        <input
                                            type="text"
                                            name="room"
                                            value={formData.room}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Lit</label>
                                        <input
                                            type="text"
                                            name="bed"
                                            value={formData.bed}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Type de Chambre</label>
                                        <select
                                            name="room_type"
                                            value={formData.room_type}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="single">Simple</option>
                                            <option value="double">Double</option>
                                            <option value="suite">Suite</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Équipements Spéciaux</label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="oxygene"
                                                name="special_equipment"
                                                checked={formData.special_equipment.oxygene}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Oxygène
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="aspiration"
                                                name="special_equipment"
                                                checked={formData.special_equipment.aspiration}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Aspiration
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="ventilation"
                                                name="special_equipment"
                                                checked={formData.special_equipment.ventilation}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Ventilation
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="pompe_perfusion"
                                                name="special_equipment"
                                                checked={formData.special_equipment.pompe_perfusion}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Pompe à Perfusion
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="moniteur_cardiaque"
                                                name="special_equipment"
                                                checked={formData.special_equipment.moniteur_cardiaque}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Moniteur Cardiaque
                                        </label>
                                        <input
                                            type="text"
                                            name="special_equipment.autre"
                                            value={formData.special_equipment.autre}
                                            onChange={(e) => handleNestedChange(e, 'special_equipment', 'autre')}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Autre"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Précautions Particulières</label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="chute"
                                                name="precautions"
                                                checked={formData.precautions.chute}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Risque de Chute
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="infection"
                                                name="precautions"
                                                checked={formData.precautions.infection}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Risque d'Infection
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="regime_special"
                                                name="precautions"
                                                checked={formData.precautions.regime_special}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Régime Alimentaire Spécial
                                        </label>
                                        <textarea
                                            name="precautions.notes"
                                            value={formData.precautions.notes}
                                            onChange={(e) => handleNestedChange(e, 'precautions', 'notes')}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Notes supplémentaires"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
                                    >
                                        Continuer
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Gestion administrative</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Type de Prise en Charge</label>
                                        <select
                                            name="payment_type"
                                            value={formData.payment_type}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="assurance_maladie">Assurance Maladie</option>
                                            <option value="assurance_privee">Assurance Privée</option>
                                            <option value="auto_paiement">Auto-Paiement</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Compagnie d'Assurance</label>
                                        <input
                                            type="text"
                                            name="insurance_details.compagnie"
                                            value={formData.insurance_details.compagnie}
                                            onChange={(e) => handleNestedChange(e, 'insurance_details', 'compagnie')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Titulaire de l'Assurance</label>
                                        <input
                                            type="text"
                                            name="insurance_details.titulaire"
                                            value={formData.insurance_details.titulaire}
                                            onChange={(e) => handleNestedChange(e, 'insurance_details', 'titulaire')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Couverture d'Assurance</label>
                                        <textarea
                                            name="insurance_details.couverture"
                                            value={formData.insurance_details.couverture}
                                            onChange={(e) => handleNestedChange(e, 'insurance_details', 'couverture')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Documents Fournis</label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="consentement"
                                                name="documents"
                                                checked={formData.documents.consentement}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Formulaire de Consentement
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="reference"
                                                name="documents"
                                                checked={formData.documents.reference}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Lettre de Référence
                                        </label>
                                        <textarea
                                            name="documents.autres"
                                            value={formData.documents.autres}
                                            onChange={(e) => handleNestedChange(e, 'documents', 'autres')}
                                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Autres documents"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Nombre de Jours Estimés</label>
                                        <input
                                            type="number"
                                            name="estimated_stay_days"
                                            value={formData.estimated_stay_days}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Coût Journalier Estimé</label>
                                        <input
                                            type="number"
                                            name="daily_cost"
                                            value={formData.daily_cost}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Coût Total Estimé</label>
                                        <input
                                            type="number"
                                            name="total_cost"
                                            value={formData.total_cost}
                                            readOnly
                                            className="w-full p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Modalités de Paiement</label>
                                        <select
                                            name="payment_terms"
                                            value={formData.payment_terms}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="direct">Paiement Direct</option>
                                            <option value="differe">Paiement Différé</option>
                                            <option value="echelonne">Paiement Échelonné</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Notes Administratives</label>
                                        <textarea
                                            name="administrative_notes"
                                            value={formData.administrative_notes}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
                                    >
                                        Continuer
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Sortie du patient</h2>
                                <p className="text-gray-600 mb-4">Ces informations peuvent être saisies ultérieurement.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Date et Heure de Sortie</label>
                                        <input
                                            type="datetime-local"
                                            name="discharge_date"
                                            value={formData.discharge_date}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Diagnostic Final</label>
                                        <textarea
                                            name="final_diagnosis"
                                            value={formData.final_diagnosis}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Résumé du Séjour</label>
                                        <textarea
                                            name="stay_summary"
                                            value={formData.stay_summary}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Traitement Prescrit</label>
                                        <input
                                            type="text"
                                            onKeyDown={(e) => handleArrayChange(e, 'prescribed_treatment')}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ul className="mt-2">
                                            {formData.prescribed_treatment.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Instructions pour le Patient</label>
                                        <textarea
                                            name="patient_instructions"
                                            value={formData.patient_instructions}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Date du Prochain Rendez-vous</label>
                                        <input
                                            type="datetime-local"
                                            name="follow_up_date"
                                            value={formData.follow_up_date}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Médecin de Suivi</label>
                                        <select
                                            name="follow_up_doctor_id"
                                            value={formData.follow_up_doctor_id}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner un médecin</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.identifier} value={doctor.identifier}>
                                                    {doctor.name} ({doctor.identifier})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Documents de Sortie</label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="rapport"
                                                name="discharge_documents"
                                                checked={formData.discharge_documents.rapport}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Compte-rendu d'Hospitalisation
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="instructions"
                                                name="discharge_documents"
                                                checked={formData.discharge_documents.instructions}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Instructions de Soins
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="arret_travail"
                                                name="discharge_documents"
                                                checked={formData.discharge_documents.arret_travail}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Arrêt de Travail
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                data-key="certificat_medical"
                                                name="discharge_documents"
                                                checked={formData.discharge_documents.certificat_medical}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            Certificat Médical
                                        </label>
                                    </div>
                                    <div className="mb-4">
                                        <label className="flex items-center">
                                            <div
                                                className={`relative inline-flex items-center cursor-pointer ${formData.discharge_confirmed ? 'bg-blue-600' : 'bg-gray-300'} rounded-full w-12 h-6 transition-colors duration-200`}
                                                onClick={() => setFormData((prev) => ({
                                                    ...prev,
                                                    discharge_confirmed: !prev.discharge_confirmed,
                                                }))}
                                            >
                                                <span
                                                    className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 ${formData.discharge_confirmed ? 'translate-x-6' : 'translate-x-1'}`}
                                                ></span>
                                            </div>
                                            <span className="ml-3 text-gray-700">Confirmer la Sortie du Patient</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4 text-gray-700">
                                    <p>En confirmant la sortie, le statut du patient sera marqué comme "Sorti". Sinon, il sera enregistré avec le statut "En cours" et pourra être modifié ultérieurement.</p>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientCreate;