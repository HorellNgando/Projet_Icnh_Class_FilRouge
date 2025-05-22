import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaIdCard, FaEnvelope, FaUserTag, FaFileAlt, FaClock, FaHistory, FaComments, FaBuilding, FaPhone } from 'react-icons/fa';
import axios from 'axios';

const LeaveDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Erreur lors de la récupération du rôle:', error);
            }
        };

        const fetchLeave = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/leave-requests/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLeave(response.data);
            } catch (error) {
                setError('Erreur lors du chargement des détails du congé');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchLeave();
    }, [id]);

    const handleApprove = async () => {
        try {
            await axios.put(`http://localhost:8000/api/leave-requests/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setLeave(prev => ({ ...prev, status: 'approved' }));
            setShowConfirmation(false);
            setActionType(null);
        } catch (error) {
            setError('Erreur lors de l\'approbation du congé');
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            setError('Veuillez fournir un motif de rejet');
            return;
        }
        try {
            await axios.put(`http://localhost:8000/api/leave-requests/${id}/reject`, {
                rejection_reason: rejectionReason
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setLeave(prev => ({ ...prev, status: 'rejected', rejection_reason: rejectionReason }));
            setShowConfirmation(false);
            setActionType(null);
            setRejectionReason('');
        } catch (error) {
            setError('Erreur lors du rejet du congé');
        }
    };

    const confirmAction = (type) => {
        setActionType(type);
        setShowConfirmation(true);
        setError(null);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'En attente';
            case 'approved':
                return 'Approuvé';
            case 'rejected':
                return 'Rejeté';
            default:
                return status;
        }
    };

    const getTypeLabel = (type) => {
        switch (type?.toLowerCase()) {
            case 'annual':
                return 'Congés annuels';
            case 'sick':
                return 'Congés maladie';
            case 'maternity':
                return 'Congés maternité';
            case 'paternity':
                return 'Congés paternité';
            case 'unpaid':
                return 'Congés sans solde';
            case 'other':
                return 'Autre';
            default:
                return type;
        }
    };

    const calculateDuration = () => {
        if (!leave?.start_date || !leave?.end_date) return '0 jours';
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg" role="alert">
                    <div className="flex items-center">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Erreur!</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Détails de la Demande de Congé</h1>
                            <div className="flex items-center space-x-4">
                                <p className="text-blue-100">ID: {leave?.id}</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(leave?.status)}`}>
                                    {getStatusLabel(leave?.status)}
                                </span>
                                <span className="text-blue-100">
                                    <FaHistory className="inline mr-1" />
                                    {formatDate(leave?.created_at)}
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-300"
                            >
                                <FaArrowLeft className="mr-2" />
                                Retour
                            </button>
                            {userRole === 'admin' && leave?.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => confirmAction('approve')}
                                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <FaCheck className="mr-2" />
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => confirmAction('reject')}
                                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <FaTimes className="mr-2" />
                                        Rejeter
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Informations de l'employé */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 transform transition-all duration-300 hover:shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
                            Informations de l'Employé
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                                <p className="text-lg font-medium text-gray-900">
                                    {leave?.staff?.name} {leave?.staff?.surname}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1 flex items-center">
                                    <FaIdCard className="mr-2 text-blue-500" />
                                    Identifiant
                                </p>
                                <p className="text-lg font-medium text-gray-900">
                                    {leave?.staff?.identifier}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1 flex items-center">
                                    <FaEnvelope className="mr-2 text-blue-500" />
                                    Email
                                </p>
                                <p className="text-lg font-medium text-gray-900">{leave?.staff?.email}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1 flex items-center">
                                    <FaUserTag className="mr-2 text-blue-500" />
                                    Rôle
                                </p>
                                <p className="text-lg font-medium text-gray-900 capitalize">{leave?.staff?.role}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1 flex items-center">
                                    <FaBuilding className="mr-2 text-blue-500" />
                                        Statut
                                </p>
                                <p className="text-lg font-medium text-gray-900">{leave?.staff?.status || 'Non spécifié'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500 mb-1 flex items-center">
                                    <FaPhone className="mr-2 text-blue-500" />
                                    Téléphone
                                </p>
                                <p className="text-lg font-medium text-gray-900">{leave?.staff?.phone || 'Non spécifié'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Détails de la demande */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 transform transition-all duration-300 hover:shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" />
                            Détails de la Demande
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Type de congé</p>
                                <p className="text-lg font-medium text-gray-900">{getTypeLabel(leave?.type)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1 flex items-center">
                                    <FaClock className="mr-2 text-blue-500" />
                                    Durée
                                </p>
                                <p className="text-lg font-medium text-gray-900">{calculateDuration()}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Date de début</p>
                                <p className="text-lg font-medium text-gray-900">
                                    {formatDate(leave?.start_date)}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Date de fin</p>
                                <p className="text-lg font-medium text-gray-900">
                                    {formatDate(leave?.end_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Motif et notes */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 transform transition-all duration-300 hover:shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaFileAlt className="mr-2 text-blue-500" />
                            Motif et Notes
                        </h3>
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 mb-2">Motif</p>
                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{leave?.reason}</p>
                            </div>
                            {leave?.notes && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 mb-2">Notes supplémentaires</p>
                                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{leave?.notes}</p>
                                </div>
                            )}
                            {leave?.rejection_reason && (
                                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                    <p className="text-sm text-red-500 mb-2">Motif du rejet</p>
                                    <p className="text-red-900 whitespace-pre-wrap leading-relaxed">{leave?.rejection_reason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Historique des modifications */}
                    {userRole === 'admin' && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 transform transition-all duration-300 hover:shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <FaHistory className="mr-2 text-blue-500" />
                                Historique des Modifications
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Création de la demande</p>
                                    <p className="text-gray-900">{formatDate(leave?.created_at)}</p>
                                </div>
                                {leave?.updated_at && leave?.updated_at !== leave?.created_at && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Dernière modification</p>
                                        <p className="text-gray-900">{formatDate(leave?.updated_at)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Boîte de dialogue de confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            {actionType === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le rejet'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {actionType === 'approve'
                                ? 'Êtes-vous sûr de vouloir approuver cette demande de congé ?'
                                : 'Êtes-vous sûr de vouloir rejeter cette demande de congé ?'}
                        </p>
                        {actionType === 'reject' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motif du rejet *
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Veuillez indiquer le motif du rejet"
                                    required
                                />
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setActionType(null);
                                    setRejectionReason('');
                                    setError(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={actionType === 'approve' ? handleApprove : handleReject}
                                className={`px-4 py-2 text-white rounded-lg transition-all duration-300 ${
                                    actionType === 'approve'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                }`}
                                disabled={actionType === 'reject' && !rejectionReason.trim()}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveDetails; 