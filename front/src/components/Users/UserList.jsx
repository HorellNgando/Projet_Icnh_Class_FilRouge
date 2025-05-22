import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaFilter, FaEdit, FaUserSlash, FaUserCheck, FaTrash, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        role: '',
        status: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, filters]);

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                search: searchTerm,
                ...filters
            });

            const response = await axios.get(`http://localhost:8000/api/users?${params}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setUsers(response.data.data);
            setTotalPages(response.data.last_page);
            setLoading(false);
        } catch (error) {
            setError('Erreur lors du chargement des utilisateurs');
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        setSelectedUser(users.find(user => user.id === userId));
        setActionType(newStatus === 'active' ? 'activate' : 'deactivate');
        setShowConfirmation(true);
    };

    const confirmStatusChange = async () => {
        try {
            const newStatus = actionType === 'activate' ? 'active' : 'inactive';
            await axios.put(`http://localhost:8000/api/users/${selectedUser.id}/status`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setUsers(users.map(user => 
                user.id === selectedUser.id ? { ...user, status: newStatus } : user
            ));
            setShowConfirmation(false);
            setSelectedUser(null);
            setActionType('');
        } catch (error) {
            setError('Erreur lors de la modification du statut');
        }
    };

    const handleDelete = async (userId) => {
        setSelectedUser(users.find(user => user.id === userId));
        setActionType('delete');
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${selectedUser.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(users.filter(user => user.id !== selectedUser.id));
            setShowConfirmation(false);
            setSelectedUser(null);
            setActionType('');
        } catch (error) {
            setError('Erreur lors de la suppression de l\'utilisateur');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'Actif';
            case 'inactive':
                return 'Inactif';
            case 'pending':
                return 'En attente';
            default:
                return status;
        }
    };

    const getRoleLabel = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'Administrateur';
            case 'medecin':
                return 'Médecin';
            case 'infirmier':
                return 'Infirmier';
            case 'secretaire':
                return 'Secrétaire';
            case 'stagiaire':
                return 'Stagiaire';
            case 'patient':
                return 'Patient';
            default:
                return role;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
                        <button
                            onClick={() => navigate('/dashboard/admin/users/invite')}
                            className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-md"
                        >
                            <FaUserPlus className="mr-2" />
                            Inviter du Personnel
                        </button>
                    </div>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un utilisateur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm"
                        >
                            <FaFilter className="mr-2" />
                            Filtres
                        </button>
                    </div>

                    {/* Panneau de filtres */}
                    {showFilters && (
                        <div className="mt-4 p-6 bg-gray-50 rounded-lg shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rôle
                                    </label>
                                    <select
                                        value={filters.role}
                                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    >
                                        <option value="">Tous les rôles</option>
                                        <option value="admin">Administrateur</option>
                                        <option value="medecin">Médecin</option>
                                        <option value="infirmier">Infirmier</option>
                                        <option value="secretaire">Secrétaire</option>
                                        <option value="stagiaire">Stagiaire</option>
                                        <option value="patient">Patient</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    >
                                        <option value="">Tous les statuts</option>
                                        <option value="active">Actif</option>
                                        <option value="inactive">Inactif</option>
                                        <option value="pending">En attente</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Liste des utilisateurs */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rôle
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {user.photo ? (
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={user.photo}
                                                        alt={user.name}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-500 text-lg font-medium">
                                                            {user.name?.charAt(0)}{user.surname?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name} {user.surname}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.identifier}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(user.status)}`}>
                                            {getStatusLabel(user.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => navigate(`/dashboard/admin/users/${user.id}/edit`)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                title="Modifier"
                                            >
                                                <FaEdit className="h-5 w-5" />
                                            </button>
                                            {user.status === 'active' ? (
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'inactive')}
                                                    className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                                                    title="Désactiver"
                                                >
                                                    <FaUserSlash className="h-5 w-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'active')}
                                                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                                    title="Activer"
                                                >
                                                    <FaUserCheck className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                title="Supprimer"
                                            >
                                                <FaTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Page {currentPage} sur {totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmation */}
            {showConfirmation && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-8 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="text-center">
                            <FaInfoCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {actionType === 'delete' ? 'Confirmer la suppression' : 
                                 actionType === 'activate' ? 'Confirmer l\'activation' : 
                                 'Confirmer la désactivation'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {actionType === 'delete' ? 
                                    `Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser.name} ${selectedUser.surname} ?` :
                                    `Êtes-vous sûr de vouloir ${actionType === 'activate' ? 'activer' : 'désactiver'} le compte de ${selectedUser.name} ${selectedUser.surname} ?`
                                }
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        setShowConfirmation(false);
                                        setSelectedUser(null);
                                        setActionType('');
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={actionType === 'delete' ? confirmDelete : confirmStatusChange}
                                    className={`px-4 py-2 rounded-md text-white transition-colors duration-200 ${
                                        actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                                        actionType === 'activate' ? 'bg-green-600 hover:bg-green-700' :
                                        'bg-yellow-600 hover:bg-yellow-700'
                                    }`}
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList; 