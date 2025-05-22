import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaCheck, FaTimes, FaEye, FaIdCard } from 'react-icons/fa';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const LeaveList = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                let response;
                if (userRole === 'admin') {
                    response = await axios.get('http://localhost:8000/api/leave-requests', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                } else {
                    response = await axios.get('http://localhost:8000/api/leave-requests/my-leaves', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                }
                const sortedLeaves = response.data.sort((a, b) => 
                    new Date(b.created_at) - new Date(a.created_at)
                );
                setLeaves(sortedLeaves);
            } catch (error) {
                setError('Erreur lors du chargement des congés');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userRole) {
            fetchLeaves();
        }
    }, [userRole]);

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/leave-requests/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setLeaves(leaves.map(leave => 
                leave.id === id ? { ...leave, status: 'approved' } : leave
            ));
        } catch (error) {
            setError('Erreur lors de l\'approbation du congé');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/leave-requests/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setLeaves(leaves.map(leave => 
                leave.id === id ? { ...leave, status: 'rejected' } : leave
            ));
        } catch (error) {
            setError('Erreur lors du rejet du congé');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    const tileClassName = ({ date }) => {
        const hasLeave = leaves.some(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            return date >= startDate && date <= endDate && leave.status === 'approved';
        });

        return hasLeave ? 'bg-green-100' : null;
    };

    const tileContent = ({ date }) => {
        const dayLeaves = leaves.filter(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            return date >= startDate && date <= endDate && leave.status === 'approved';
        });

        if (dayLeaves.length > 0) {
            return (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {userRole === 'admin' ? 'Gestion des Congés' : 'Mes Congés'}
                    </h1>
                    <div className="flex space-x-4">
                        {userRole === 'admin' && (
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            >
                                <FaCalendarAlt className="mr-2" />
                                {showCalendar ? 'Liste' : 'Calendrier'}
                            </button>
                        )}
                        {userRole !== 'admin' && (
                            <Link
                                to={`/dashboard/${userRole}/leaves/new`}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            >
                                <FaPlus className="mr-2" />
                                Nouvelle Demande
                            </Link>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                {!showCalendar ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employé
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Identifiant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de début
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de fin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {leave.staff?.name?.[0]}{leave.staff?.surname?.[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {leave.staff?.name} {leave.staff?.surname}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {leave.staff?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <FaIdCard className="mr-2 text-blue-500" />
                                                {leave.staff?.identifier}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {getTypeLabel(leave.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(leave.start_date).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(leave.end_date).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                                                {getStatusLabel(leave.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <Link
                                                    to={`/dashboard/${userRole}/leaves/${leave.id}`}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    <FaEye />
                                                </Link>
                                                {userRole === 'admin' && leave.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(leave.id)}
                                                            className="text-green-600 hover:text-green-900 transition-colors"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(leave.id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6">
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileClassName={tileClassName}
                            tileContent={tileContent}
                            className="w-full border-0"
                        />
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Congés du {selectedDate.toLocaleDateString('fr-FR')}</h3>
                            <div className="space-y-4">
                                {leaves
                                    .filter(leave => {
                                        const startDate = new Date(leave.start_date);
                                        const endDate = new Date(leave.end_date);
                                        return selectedDate >= startDate && selectedDate <= endDate && leave.status === 'approved';
                                    })
                                    .map(leave => (
                                        <div key={leave.id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {leave.staff?.name} {leave.staff?.surname}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{getTypeLabel(leave.type)}</p>
                                                </div>
                                                <Link
                                                    to={`/dashboard/${userRole}/leaves/${leave.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEye />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveList; 