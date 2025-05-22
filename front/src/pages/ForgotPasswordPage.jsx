import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import api from './api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/forgot-password', { email });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/verify-code', { state: { email } });
      }, 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Aucun compte n\'est associé à cette adresse email.');
      } else if (err.response?.status === 500) {
        setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.');
      } else {
        setError(err.response?.data?.error || 'Une erreur est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="flex flex-col items-center pt-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="w-20 h-20 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Mot de passe oublié</h1>
        </div>

        <div className="p-8 text-gray-800">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-1">Réinitialisation du mot de passe</h2>
            <p className="text-sm text-gray-600">
              Entrez votre adresse email pour recevoir un code de vérification
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-md text-sm bg-green-100 text-green-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@exemple.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Envoi en cours...
                  </>
                ) : 'Envoyer le code'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}