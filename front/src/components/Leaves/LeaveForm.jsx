import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const LeaveForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
        notes: '',
        status: 'pending'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

        try {
            // Récupérer l'ID de l'utilisateur connecté
            const userResponse = await axios.get('http://localhost:8000/api/user', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            
            // Préparer les données selon les validations du backend
            const requestData = {
                staff_id: userResponse.data.id,
                type: formData.type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                reason: formData.reason,
                notes: formData.notes || null,
                status: 'pending'
            };

            // Vérifier que toutes les données requises sont présentes
            if (!requestData.staff_id || !requestData.start_date || !requestData.end_date || !requestData.reason) {
                throw new Error('Veuillez remplir tous les champs obligatoires');
            }

            // Vérifier que la date de fin est après la date de début
            if (new Date(requestData.end_date) < new Date(requestData.start_date)) {
                throw new Error('La date de fin doit être postérieure à la date de début');
            }

            const response = await axios.post('http://localhost:8000/api/leave-requests', requestData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.data) {
                navigate(-1);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                // Gérer les erreurs de validation du backend
                const validationErrors = Object.values(error.response.data.errors).flat();
                setError(validationErrors.join(', '));
            } else {
                setError(error.message || 'Erreur lors de la création de la demande de congé');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Nouvelle Demande de Congé</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        <FaTimes className="mr-2" />
                        Annuler
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type de congé *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="annual">Congés annuels</option>
                                <option value="sick">Congés maladie</option>
                                <option value="emergency">Congés d'urgence</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de début *
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de fin *
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                min={formData.start_date || new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motif *
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Veuillez expliquer la raison de votre demande de congé"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes supplémentaires
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informations complémentaires (optionnel)"
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveForm; 