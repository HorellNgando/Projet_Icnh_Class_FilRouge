import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from './api';

export default function VerifyCodePageB() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes en secondes
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/verify-code', { email, code });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/reset-password', { 
          state: { 
            email,
            token: response.data.reset_token 
          } 
        });
      }, 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Code invalide ou expiré. Veuillez réessayer.');
      } else {
        setError(err.response?.data?.error || 'Une erreur est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/forgot-password', { email });
      setSuccess('Un nouveau code a été envoyé à votre email.');
      setTimeLeft(900); // Réinitialiser le timer
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Aucun compte n\'est associé à cette adresse email.');
      } else if (err.response?.status === 500) {
        setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.');
      } else {
        setError(err.response?.data?.error || 'Une erreur est survenue');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="flex flex-col items-center pt-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <img src="/inch2.png" alt="Logo" className="w-20 h-20 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Vérification du code</h1>
        </div>

        <div className="p-8 text-gray-800">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-1">Entrez le code de vérification</h2>
            <p className="text-sm text-gray-600">
              Un code a été envoyé à {email}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Temps restant : <span className="font-medium">{formatTime(timeLeft)}</span>
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
              <label htmlFor="code" className="block text-sm font-medium mb-1 text-gray-700">
                Code de vérification
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                }}
                className="w-full px-3 py-2.5 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
                placeholder="123456"
                required
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || timeLeft <= 0}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Vérification...
                  </>
                ) : 'Vérifier le code'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={handleResendCode}
              disabled={isResending || timeLeft > 0}
              className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 inline mr-1" />
                  Envoi en cours...
                </>
              ) : 'Renvoyer le code'}
            </button>
          </div>
        </div>

        <div className="px-8 py-4 text-center text-xs bg-gray-50 text-gray-500">
          © {new Date().getFullYear()} Gestionnaire d'équipements. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}