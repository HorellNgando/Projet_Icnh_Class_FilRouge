import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaUser, FaIdCard, FaUserTag } from 'react-icons/fa';
import axios from 'axios';

const InviteStaff = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        role: 'medecin',
        department: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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
            await axios.post('http://localhost:8000/api/invite', {
                email: formData.email,
                role: formData.role
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccess(true);
            setFormData({
                email: '',
                name: '',
                surname: '',
                role: 'medecin',
                department: ''
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* En-tête */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-white">Inviter du Personnel</h1>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-300"
                            >
                                <FaArrowLeft className="mr-2" />
                                Retour
                            </button>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
                                <p>L'invitation a été envoyée avec succès ! Un email a été envoyé à l'adresse indiquée.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="email@exemple.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rôle
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserTag className="text-gray-400" />
                                    </div>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="medecin">Médecin</option>
                                        <option value="infirmier">Infirmier</option>
                                        <option value="secretaire">Secrétaire</option>
                                        <option value="stagiaire">Stagiaire</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    {loading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteStaff; 