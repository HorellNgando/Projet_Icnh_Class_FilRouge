import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
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
            const response = await axios.post('http://localhost:8000/api/register', formData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role);

            // Redirection vers le tableau de bord patient
            navigate('/patient/dashboard');
        } catch (err) {
            console.log(err.response);
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mt-32">Créer un compte</h1>
        <p className="text-center text-gray-600 mb-8">
          Inscrivez-vous pour accéder à votre espace personnel et gérer vos rendez-vous médicaux
        </p>
        <div className="max-w-xl mx-auto">
          {/* Ajout des messages d'erreur et de succès */}
          {error && <p className="text-red-500 text-center mb-6">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="border p-3 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="border p-3 rounded w-full"
                  required
                />
              </div>
            </div>
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
              <label className="block text-gray-700">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+237 6..."
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Adresse"
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="border p-3 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700, 20">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="border p-3 rounded w-full"
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <label className="text-blue-600">
                J’accepte les <a href="#" className="underline">conditions d’utilisation</a> et les <a href="#" className="underline">politiques de confidentialité</a>
              </label>
            </div>
            <button
                type="submit"
                className={`bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                disabled={loading}
            >
                {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
            <p className="text-center text-blue-600 mt-2">
              Vous avez déjà un compte ? <a href="/login" className="underline">Se connecter</a>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;