import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaEdit, FaSave, FaTimes, FaUpload, FaUser, FaLock, FaBell } from 'react-icons/fa';
import { userService } from '../services/api';
import '../styles/common.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        address: '',
        photo: null
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [preferences, setPreferences] = useState({
        email_notifications: true,
        sms_notifications: false,
        language: 'fr',
        theme: 'light'
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    // Liste de couleurs pour l'arrière-plan de l'avatar
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];

    // Sélectionner une couleur aléatoire
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Générer les initiales
    const getInitials = (name, surname) => {
        return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userService.getCurrentUser();
                setUser(response.data);
                setFormData({
                    name: response.data.name || '',
                    surname: response.data.surname || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    address: response.data.address || '',
                    photo: null
                });
                if (response.data.photo) {
                    setPreviewUrl(`http://localhost:8000/storage/${response.data.photo}`);
                }
                if (response.data.preferences) {
                    setPreferences(response.data.preferences);
                }
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement du profil');
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await userService.updateProfile(formDataToSend);
            setUser(response.data);
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

        try {
            await userService.changePassword(passwordData);
            setSuccess(true);
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loading-spinner">
                    <FaSpinner className="h-12 w-12 text-primary-color" />
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card p-6">
                <div className="page-header">
                    <h2 className="page-title">Mon Profil</h2>
                    <p className="page-description">Gérez vos informations personnelles</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
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
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Photo de profil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center text-2xl font-bold text-white ${randomColor}`}>
                                            {getInitials(formData.name, formData.surname)}
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="photo-upload"
                                    className="absolute bottom-0 right-0 bg-primary-color text-white p-2 rounded-full cursor-pointer hover:bg-primary-hover"
                                >
                                    <FaUpload />
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    required
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="form-input mt-1"
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input mt-1"
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
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-input mt-1"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Adresse
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="form-input mt-1"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
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
                                    className="form-input mt-1"
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
                                    className="form-input mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirmer le nouveau mot de passe *
                                </label>
                                <input
                                    type="password"
                                    id="new_password_confirmation"
                                    name="new_password_confirmation"
                                    required
                                    value={passwordData.new_password_confirmation}
                                    onChange={handlePasswordChange}
                                    className="form-input mt-1"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
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
                                    className="form-input mt-1"
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
                                    className="form-input mt-1"
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
                                className="btn btn-primary"
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

export default Profile; 