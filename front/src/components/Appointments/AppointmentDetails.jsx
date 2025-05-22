import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { appointmentService } from '../../services/api';

const AppointmentDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        status: '',
        notes: ''
    });

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await appointmentService.getAppointmentById(id);
                setAppointment(response.data);
                setFormData({
                    status: response.data.status,
                    notes: response.data.notes || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement du rendez-vous');
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

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
            await appointmentService.updateAppointment(id, formData);
            setSuccess(true);
            setIsEditing(false);
            // Rafraîchir les données
            const response = await appointmentService.getAppointmentById(id);
            setAppointment(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du rendez-vous');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
            try {
                await appointmentService.deleteAppointment(id);
                navigate('/dashboard/admin/appointments');
            } catch (err) {
                setError('Erreur lors de la suppression du rendez-vous');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planned':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'planned':
                return 'Planifié';
            case 'in_progress':
                return 'En cours';
            case 'completed':
                return 'Terminé';
            case 'cancelled':
                return 'Annulé';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Rendez-vous non trouvé</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Détails du Rendez-vous</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/dashboard/admin/appointments')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            <FaArrowLeft className="mr-2" />
                            Retour
                        </button>
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center px-4 py-2 text-red-600 hover:text-red-800"
                                >
                                    <FaTrash className="mr-2" />
                                    Supprimer
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Succès!</strong>
                        <span className="block sm:inline"> Le rendez-vous a été mis à jour avec succès.</span>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="planned">Planifié</option>
                                    <option value="in_progress">En cours</option>
                                    <option value="completed">Terminé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </div>

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

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                <FaTimes className="mr-2" />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaCheck className="mr-2" />
                                {loading ? 'Mise à jour...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {appointment.patient?.name} {appointment.patient?.surname}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Médecin</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    Dr. {appointment.doctor?.name} {appointment.doctor?.surname}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {new Date(appointment.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Heure</h3>
                                <p className="mt-1 text-lg text-gray-900">{appointment.time}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Motif</h3>
                                <p className="mt-1 text-lg text-gray-900">{appointment.reason}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                                <p className="mt-1">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                    </span>
                                </p>
                            </div>

                            {appointment.notes && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                    <p className="mt-1 text-lg text-gray-900">{appointment.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetails; 