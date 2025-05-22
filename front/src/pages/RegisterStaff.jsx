import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaIdBadge, FaPhoneAlt } from 'react-icons/fa';

const RegisterStaff = () => {
    const { state } = useLocation();
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        surname: '',
        email: state?.email || '',
        phone: '',
        password: '',
        password_confirmation: '',
        // photo: null,
        accept: false,
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.accept) {
            setError("Vous devez accepter les conditions d'utilisation et la politique de confidentialité.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/register-staff', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            localStorage.setItem('token', response.data.token);
            navigate(`/dashboard/${response.data.user.role}`);
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            <div className="flex flex-col items-center pt-10">
                <a href="/">
                    <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-20 mb-4 rounded-full shadow-md shadow-gray-100" />
                </a>
                <div className="w-full max-w-2xl mx-auto mt-2">
                    <h1 className="text-4xl font-bold text-center mb-2">Créer un compte personnel</h1>
                    <p className="text-gray-500 text-center mb-8">Inscrivez-vous pour accéder à votre espace personnel et gérer vos dossiers médicaux</p>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-semibold mb-1">Code de vérification</label>
                            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                <FaIdBadge className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Code reçu par email"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold mb-1">Nom</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaUser className="text-gray-400 mr-2 rotate-90" />
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Prenom</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaUser className="text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Votre prenom"
                                        value={formData.surname}
                                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                        className="w-full bg-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Email</label>
                            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    placeholder="votreemail@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-transparent outline-none"
                                    required
                                    disabled
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Téléphone</label>
                            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                <FaPhoneAlt className="text-gray-400 mr-2" />
                                <input
                                    type="tel"
                                    placeholder="+237 6 ..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold mb-1">Mot de passe</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaLock className="text-gray-400 mr-2" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="********"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-transparent outline-none"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 focus:outline-none">
                                        {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Confirmer le mot de passe</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaLock className="text-gray-400 mr-2" />
                                    <input
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        placeholder="********"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full bg-transparent outline-none"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="ml-2 focus:outline-none">
                                        {showPasswordConfirm ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.accept}
                                onChange={(e) => setFormData({ ...formData, accept: e.target.checked })}
                                className="mr-2"
                                id="accept"
                            />
                            <label htmlFor="accept" className="font-semibold text-sm">
                                J'accepte les <Link to="/conditions" className="text-blue-600 hover:underline">conditions d'utilisation</Link> et les <Link to="/confidentialite" className="text-blue-600 hover:underline">politiques de confidentialité</Link>
                            </label>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">Créer un compte</button>
                        <div className="text-center text-gray-700">
                            Vous avez déjà un compte ?{' '}
                            <Link to="/login-staff" className="text-blue-600 hover:underline">Se connecter</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterStaff;