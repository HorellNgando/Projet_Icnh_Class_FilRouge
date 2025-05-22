import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaUser, FaLock, FaBell, FaSave } from 'react-icons/fa';
import { userService } from '../services/api';

const UserProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        role: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [preferences, setPreferences] = useState({
        email_notifications: true,
        sms_notifications: false,
        language: 'fr',
        theme: 'light'
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await userService.getCurrentUser();
                setProfileData(response.data);
            } catch (err) {
                setError('Erreur lors du chargement du profil');
            }
        };

        fetchUserProfile();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreferenceChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await userService.updateProfile(profileData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            await userService.changePassword(passwordData);
            setSuccess(true);
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setLoading(false);
        }
    };

    const handlePreferencesSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await userService.updatePreferences(preferences);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour des préférences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Mon Profil</h2>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        Modifications enregistrées avec succès !
                    </div>
                )}

                <div className="mb-6">
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'profile'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaUser className="inline-block mr-2" />
                            Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'password'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaLock className="inline-block mr-2" />
                            Mot de passe
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'preferences'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaBell className="inline-block mr-2" />
                            Préférences
                        </button>
                    </nav>
                </div>

                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    required
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    required
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Adresse
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleProfileChange}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Enregistrement...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <FaSave className="mr-2" />
                                        Enregistrer
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe actuel *
                                </label>
                                <input
                                    type="password"
                                    id="current_password"
                                    name="current_password"
                                    required
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                    Nouveau mot de passe *
                                </label>
                                <input
                                    type="password"
                                    id="new_password"
                                    name="new_password"
                                    required
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                                    Confirmer le mot de passe *
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    required
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Modification...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <FaLock className="mr-2" />
                                        Changer le mot de passe
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'preferences' && (
                    <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="email_notifications"
                                    name="email_notifications"
                                    checked={preferences.email_notifications}
                                    onChange={handlePreferenceChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-900">
                                    Recevoir les notifications par email
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="sms_notifications"
                                    name="sms_notifications"
                                    checked={preferences.sms_notifications}
                                    onChange={handlePreferenceChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="sms_notifications" className="ml-2 block text-sm text-gray-900">
                                    Recevoir les notifications par SMS
                                </label>
                            </div>

                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                    Langue
                                </label>
                                <select
                                    id="language"
                                    name="language"
                                    value={preferences.language}
                                    onChange={handlePreferenceChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                    Thème
                                </label>
                                <select
                                    id="theme"
                                    name="theme"
                                    value={preferences.theme}
                                    onChange={handlePreferenceChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="light">Clair</option>
                                    <option value="dark">Sombre</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Enregistrement...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <FaSave className="mr-2" />
                                        Enregistrer les préférences
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile; 