import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
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
      setError('Le champ mot de passe est requis.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      if (user.status !== 'actif') {
        setError('Votre compte a été licencié. Contactez l\'administrateur.');
        localStorage.clear();
        return;
      }

      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard'); break;
        case 'medecin':
          navigate('/medecin/dashboard'); break;
        case 'infirmier':
          navigate('/infirmier/add-patient'); break;
        default:
          setError('Accès non autorisé pour ce rôle.');
          localStorage.clear();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion Administrateur</h2>
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>
          <p className="text-center text-blue-600 mt-2">
            Mot de passe oublié ? <a href="#" className="underline">Réinitialiser</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
