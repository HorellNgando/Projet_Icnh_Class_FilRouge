import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('The password field is required.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      if (user.status !== 'actif') {
        setError('Votre compte a été licencié. Contactez l\'administrateur.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        return;
      }

      // Redirection selon le rôle
      if (user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'medecin') {
        navigate('/medecin/dashboard');
      } else if (user.role === 'infirmier') {
        navigate('/infirmier/add-patient');
      }
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || 'Erreur de connexion');
      if (err.response?.status === 422) {
        setError('Les données fournies sont invalides. Vérifiez vos identifiants.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mt-32">Connexion</h1>
        <p className="text-center text-gray-600 mt-5 mb-5">
          Accédez à votre espace personnel pour gérer vos <br />rendez-vous et dossiers médicaux
        </p>
        <div className="max-w-md mx-auto">
          {/* Ajout des messages d'erreur et de succès */}
          {error && <p className="text-red-500 text-center mb-6">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                placeholder="********"
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-gray-700">Se souvenir de moi</label>
            </div>
            <button
              type="submit"
              className={`bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
            <p className="text-center text-blue-600 mt-2">
              <a href="#" className="underline">Mot de passe oublié ?</a>
            </p>
            <p className="text-center text-blue-600 mt-2">
              Vous n’avez pas de compte ? <a href="/register" className="underline">S’inscrire</a>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;