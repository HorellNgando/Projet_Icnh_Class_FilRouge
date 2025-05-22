import React, { useState } from 'react';
import { FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        navigate('/login-staff');
    };

    const getInitials = (name, surname) => {
        return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
    };

    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
    const colorIndex = (user?.name?.length || 0) % colors.length;
    const bgColor = colors[colorIndex];

    const getRoleLabel = (role) => {
        const roles = {
            admin: 'Administrateur',
            medecin: 'Médecin',
            infirmier: 'Infirmier',
            stagiaire: 'Stagiaire',
            secretaire: 'Secrétaire',
            patient: 'Patient'
        };
        return roles[role] || role;
    };

    return (
        <nav className="bg-white shadow-sm h-16 fixed top-0 right-0 left-64 z-10">
            <div className="px-6 h-full flex items-center justify-between">
                {/* Titre */}
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Tableau de bord
                        <span className="ml-2 text-gray-500 font-normal">
                            {getRoleLabel(user?.role)}
                        </span>
                    </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-6">
                    {/* Notifications */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <FaBell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Menu des notifications */}
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm text-gray-600">Aucune notification pour le moment</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu utilisateur */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            {user?.photo ? (
                                <img
                                    src={user.photo}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                                />
                            ) : (
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-gray-100"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {getInitials(user?.name, user?.surname)}
                                </div>
                            )}
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-700">
                                    {user?.name} {user?.surname}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{getRoleLabel(user?.role)}</p>
                            </div>
                        </button>

                        {/* Menu déroulant */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user?.name} {user?.surname}</p>
                                    <p className="text-xs text-gray-500 capitalize">{getRoleLabel(user?.role)}</p>
                                </div>
                                <Link
                                    to={`/dashboard/${user?.role}/profile`}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                >
                                    <FaUser className="h-4 w-4" />
                                    <span>Mon Profil</span>
                                </Link>
                                <Link
                                    to={`/dashboard/${user?.role}/settings`}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                >
                                    <FaCog className="h-4 w-4" />
                                    <span>Paramètres</span>
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                    <FaSignOutAlt className="h-4 w-4" />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 