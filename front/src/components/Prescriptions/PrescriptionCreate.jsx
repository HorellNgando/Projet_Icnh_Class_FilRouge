import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { prescriptionService } from '../../services/api';
import { patientService } from '../../services/api';
import { userService } from '../../services/api';

const PrescriptionCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [formData, setFormData] = useState({
        patient_id: '',
        date: new Date().toISOString().split('T')[0],
        medications: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        notes: '',
        status: 'active'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login-staff');
            return;
        }

        // Récupérer le rôle de l'utilisateur depuis le token
        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role);

        if (!['admin', 'medecin'].includes(user?.role)) {
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                console.log('Fetching patients and doctors...');
                const [patientsResponse, doctorsResponse] = await Promise.all([
                    patientService.getAllPatientsList(),
                    userService.getAllUsers({ role: 'medecin' })
                ]);
                console.log('Patients response:', patientsResponse);
                console.log('Doctors response:', doctorsResponse);
                setPatients(patientsResponse);
                setDoctors(doctorsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Erreur lors du chargement des données');
            }
        };

        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Format the data according to backend expectations
            const formattedData = {
                patient_id: formData.patient_id,
                medications: [{
                    name: formData.medications,
                    dosage: formData.dosage,
                    frequency: formData.frequency,
                    duration: formData.duration
                }],
                notes: formData.notes,
                valid_until: formData.date
            };

            await prescriptionService.createPrescription(formattedData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/admin/prescriptions');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la prescription');
        } finally {
            setLoading(false);
        }
    };

    if (!['admin', 'medecin'].includes(userRole)) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Nouvelle Prescription</h2>
                    <button
                        onClick={() => navigate('/dashboard/admin/prescriptions')}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        <FaArrowLeft className="mr-2" />
                        Retour
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Erreur!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Succès!</strong>
                        <span className="block sm:inline"> La prescription a été créée avec succès.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Patient */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Patient *
                            </label>
                            <select
                                name="patient_id"
                                value={formData.patient_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.identifier} - {patient.first_name} {patient.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Médicaments */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Médicaments *
                            </label>
                            <textarea
                                name="medications"
                                value={formData.medications}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Liste des médicaments prescrits"
                            />
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dosage *
                            </label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 500mg"
                            />
                        </div>

                        {/* Fréquence */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fréquence *
                            </label>
                            <input
                                type="text"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 3 fois par jour"
                            />
                        </div>

                        {/* Durée */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Durée *
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 7 jours"
                            />
                        </div>

                        {/* Instructions */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instructions
                            </label>
                            <textarea
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Instructions spécifiques pour la prise des médicaments"
                            />
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Notes additionnelles"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaCheck className="mr-2" />
                            {loading ? 'Création...' : 'Créer la prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionCreate; 