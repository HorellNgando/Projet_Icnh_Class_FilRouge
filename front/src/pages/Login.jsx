import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', remember_me: false });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard/patient');
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de la connexion');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            <div className="flex flex-col items-center pt-10">
                <a href="/">
                    <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-20 mb-4 rounded-full shadow-md shadow-gray-100" />
                </a>
                <div className="w-full max-w-lg mx-auto mt-2">
                    <h1 className="text-4xl font-bold text-center mb-2">Connexion</h1>
                    <p className="text-gray-500 text-center mb-8">Accédez à votre espace personnel pour gérer vos rendez-vous et dossiers médicaux</p>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                />
                            </div>
                        </div>
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
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.remember_me}
                                onChange={(e) => setFormData({ ...formData, remember_me: e.target.checked })}
                                className="mr-2"
                                id="remember_me"
                            />
                            <label htmlFor="remember_me" className="font-semibold">Se souvenir de moi</label>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">Se Connecter</button>
                        <div className="text-center mt-2">
                            <Link to="/forgot-password" className="text-blue-600 hover:underline">Mot de passe oublié ?</Link>
                        </div>
                        <div className="text-center text-gray-700">
                            Vous n'avez pas de compte ?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">S'inscrire</Link>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
};

export default Login;