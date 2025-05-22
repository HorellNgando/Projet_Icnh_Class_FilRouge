import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { leaveRequestService } from '../../services/api';

const LeaveRequestCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
        emergency_contact: '',
        documents: null
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            await leaveRequestService.createLeaveRequest(formDataToSend);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/admin/leaves');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la demande');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Nouvelle Demande de Congé</h2>
                    <button
                        onClick={() => navigate('/dashboard/admin/leaves')}
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
                        <span className="block sm:inline"> La demande a été créée avec succès.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type de congé */}
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

                        {/* Date de début */}
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

                        {/* Date de fin */}
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

                        {/* Contact d'urgence */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact d'urgence
                            </label>
                            <input
                                type="text"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nom et numéro de téléphone"
                            />
                        </div>

                        {/* Documents */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documents justificatifs
                            </label>
                            <input
                                type="file"
                                name="documents"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG
                            </p>
                        </div>

                        {/* Raison */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Raison *
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Détaillez la raison de votre demande de congé..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaCheck className="mr-2" />
                            {loading ? 'Création...' : 'Soumettre la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveRequestCreate; 