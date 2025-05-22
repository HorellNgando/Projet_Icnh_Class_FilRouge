import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { appointmentService, patientService, userService } from '../../services/api';

const AppointmentCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);

    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        time: '',
        reason: '',
        duration: 45, // Durée par défaut de 45 minutes
        notes: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer la liste des patients
                const patientsResponse = await patientService.getAllPatients();
                setPatients(patientsResponse.data);

                // Récupérer la liste des médecins
                const doctorsResponse = await userService.getUsersByRole('medecin');
                setDoctors(doctorsResponse.data);
            } catch (err) {
                setError('Erreur lors du chargement des données');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (formData.date && formData.doctor_id) {
                try {
                    const response = await appointmentService.getAvailableSlots(
                        formData.doctor_id,
                        formData.date
                    );
                    setAvailableSlots(response.data);
                } catch (err) {
                    setError('Erreur lors de la récupération des créneaux disponibles');
                }
            }
        };

        fetchAvailableSlots();
    }, [formData.date, formData.doctor_id]);

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
            await appointmentService.createAppointment(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/admin/appointments');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du rendez-vous');
        } finally {
            setLoading(false);
        }
    };

    const generateTimeSlots = () => {
        const slots = [];
        const startTime = 8; // 8h
        const endTime = 18; // 18h
        const interval = 45; // 45 minutes

        for (let hour = startTime; hour < endTime; hour++) {
            for (let minute = 0; minute < 60; minute += interval) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const isAvailable = availableSlots.includes(time);
                slots.push({ time, isAvailable });
            }
        }

        return slots;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Nouveau Rendez-vous</h2>
                    <button
                        onClick={() => navigate('/dashboard/admin/appointments')}
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
                        <span className="block sm:inline"> Le rendez-vous a été créé avec succès.</span>
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
                                        {patient.name} {patient.surname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Médecin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Médecin *
                            </label>
                            <select
                                name="doctor_id"
                                value={formData.doctor_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un médecin</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        Dr. {doctor.name} {doctor.surname}
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
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Heure */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Heure *
                            </label>
                            <select
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner une heure</option>
                                {generateTimeSlots().map(slot => (
                                    <option
                                        key={slot.time}
                                        value={slot.time}
                                        disabled={!slot.isAvailable}
                                    >
                                        {slot.time} {!slot.isAvailable && '(Indisponible)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Motif */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motif *
                            </label>
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Motif du rendez-vous"
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
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Notes additionnelles"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave className="mr-2" />
                            {loading ? 'Création en cours...' : 'Créer le rendez-vous'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentCreate; 