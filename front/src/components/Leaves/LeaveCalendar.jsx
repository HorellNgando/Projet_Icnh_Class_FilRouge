import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCalendarAlt, FaUser, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const LeaveCalendar = () => {
    const [leaves, setLeaves] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

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

        const fetchLeaves = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/leave-requests', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLeaves(response.data);
            } catch (error) {
                setError('Erreur lors du chargement des congés');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchLeaves();
    }, []);

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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayLeaves = leaves.filter(leave => {
                const start = new Date(leave.start_date);
                const end = new Date(leave.end_date);
                return date >= start && date <= end && leave.status === 'approved';
            });

            if (dayLeaves.length > 0) {
                return (
                    <div className="absolute inset-0 bg-green-100 opacity-50 rounded-full"></div>
                );
            }
        }
        return null;
    };

    const getLeavesForDate = (date) => {
        return leaves.filter(leave => {
            const start = new Date(leave.start_date);
            const end = new Date(leave.end_date);
            return date >= start && date <= end;
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <FaCalendarAlt className="mr-3" />
                        Calendrier des Congés
                    </h1>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendrier */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    tileContent={tileContent}
                                    className="w-full border-0"
                                    locale="fr-FR"
                                    minDetail="month"
                                    next2Label={null}
                                    prev2Label={null}
                                    showNeighboringMonth={false}
                                    tileClassName={({ date }) => {
                                        const dayLeaves = getLeavesForDate(date);
                                        return dayLeaves.length > 0 ? 'relative' : '';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Liste des congés pour la date sélectionnée */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaClock className="mr-2 text-blue-500" />
                                    Congés du {formatDate(selectedDate)}
                                </h2>
                                <div className="space-y-4">
                                    {getLeavesForDate(selectedDate).length > 0 ? (
                                        getLeavesForDate(selectedDate).map(leave => (
                                            <div
                                                key={leave.id}
                                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 transform transition-all duration-300 hover:shadow-md"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <FaUser className="text-blue-500 mr-2" />
                                                        <span className="font-medium">
                                                            {leave.staff?.name} {leave.staff?.surname}
                                                        </span>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                                        {getStatusLabel(leave.status)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="flex items-center">
                                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                                        {getTypeLabel(leave.type)}
                                                    </p>
                                                    <p className="flex items-center">
                                                        <FaClock className="mr-2 text-blue-500" />
                                                        {calculateDuration(leave.start_date, leave.end_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-4">
                                            Aucun congé prévu pour cette date
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveCalendar; 