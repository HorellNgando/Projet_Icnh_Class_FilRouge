import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight, FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { notificationService } from '../../services/api';

const NotificationList = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login-staff');
            return;
        }

        const fetchNotifications = async () => {
            try {
                const response = await notificationService.getAllNotifications();
                setNotifications(response.data || []);
                setFilteredNotifications(response.data || []);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des notifications');
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [navigate]);

    useEffect(() => {
        const filtered = (notifications || []).filter(notification => 
            notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNotifications(filtered);
        setCurrentPage(1);
    }, [searchTerm, notifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markNotificationAsRead(id);
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id
                        ? { ...notification, status: 'read' }
                        : notification
                )
            );
        } catch (err) {
            setError('Erreur lors de la mise à jour de la notification');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
            try {
                await notificationService.deleteNotification(id);
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notification => notification.id !== id)
                );
            } catch (err) {
                setError('Erreur lors de la suppression de la notification');
            }
        }
    };

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = (filteredNotifications || []).slice(indexOfFirstNotification, indexOfLastNotification);
    const totalPages = Math.ceil((filteredNotifications || []).length / notificationsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'appointment': return 'bg-blue-100 text-blue-800';
            case 'prescription': return 'bg-green-100 text-green-800';
            case 'medical_record': return 'bg-purple-100 text-purple-800';
            case 'leave_request': return 'bg-yellow-100 text-yellow-800';
            case 'system': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'appointment': return 'Rendez-vous';
            case 'prescription': return 'Ordonnance';
            case 'medical_record': return 'Dossier médical';
            case 'leave_request': return 'Demande de congé';
            case 'system': return 'Système';
            default: return type;
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une notification..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {currentNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-lg border ${
                                notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                                        <FaBell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                                        <p className="mt-1 text-gray-600">{notification.message}</p>
                                        <div className="mt-2 flex items-center space-x-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                                                {getTypeLabel(notification.type)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {notification.status === 'unread' && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-2 text-green-600 hover:text-green-800"
                                            title="Marquer comme lu"
                                        >
                                            <FaCheck className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="p-2 text-red-600 hover:text-red-800"
                                        title="Supprimer"
                                    >
                                        <FaTrash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredNotifications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Aucune notification trouvée
                    </div>
                )}

                {/* Pagination */}
                {filteredNotifications.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                        <div className="flex justify-between flex-1 sm:hidden">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Affichage de <span className="font-medium">{indexOfFirstNotification + 1}</span> à{' '}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastNotification, filteredNotifications.length)}
                                    </span>{' '}
                                    sur <span className="font-medium">{filteredNotifications.length}</span> résultats
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronLeft className="h-5 w-5" />
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                ${currentPage === index + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationList; 