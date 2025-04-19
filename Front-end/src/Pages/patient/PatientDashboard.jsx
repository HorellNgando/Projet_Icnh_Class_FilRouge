import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';


const PatientDashboard = () => {
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [health, setHealth] = useState({});
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const userResponse = await axios.get('http://localhost:8000/api/user/profile', { headers });
        setUser(userResponse.data);

        const appointmentsResponse = await axios.get('http://localhost:8000/api/patient/appointments', { headers });
        setAppointments(appointmentsResponse.data);

        const messagesResponse = await axios.get('http://localhost:8000/api/patient/messages', { headers });
        setMessages(messagesResponse.data);

        const healthResponse = await axios.get('http://localhost:8000/api/patient/health', { headers });
        setHealth(healthResponse.data);

        const lastLoginResponse = await axios.get('http://localhost:8000/api/patient/last-login', { headers });
        setLastLogin(lastLoginResponse.data.last_login);
      } catch (err) {
        console.error('Erreur lors du chargement des données', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-3/4 ml-80">
      <Sidebar role="patient" />
      <div className="flex-1 ml-0 md:ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Dernière connexion: {lastLogin}</span>
            <span className="relative">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0h12v10H4V5zm2 2h8v2H6V7zm0 4h4v2H6v-2z" />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">3</span>
            </span>
            <span className="relative">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0h12v10H4V5zm2 2h8v2H6V7zm0 4h4v2H6v-2z" />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">2</span>
            </span>
            <span>{user.nom} {user.prenom}</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0h12v10H4V5zm2 2h8v2H6V7zm0 4h4v2H6v-2z" />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">3</span>
          </span>
          <span className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0h12v10H4V5zm2 2h8v2H6V7zm0 4h4v2H6v-2z" />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">2</span>
          </span>
          <span>{user.nom} {user.prenom}</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </div>
      </div>

      {/* En-tête */}
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">
          Bienvenue, {user.nom} {user.prenom}
        </h2>
        <p>Nous espérons vous allez bien aujourd’hui !</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Prochain rendez-vous</h3>
          <p className="text-lg font-bold">15 mars 2025, 10:30</p>
          <p className="text-gray-500">Dr Claire Moreau, Cardiologie</p>
          <a href="#" className="text-blue-600">Voir tous les rendez-vous →</a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Résultats analyses sanguines</h3>
          <p className="text-lg font-bold">Disponible le 10/03/2025</p>
          <p className="text-gray-500">Analyse sanguine</p>
          <a href="#" className="text-blue-600">Consulter les résultats →</a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Messages non lus</h3>
          <p className="text-lg font-bold">3 nouveaux messages</p>
          <p className="text-gray-500">Dr Michel Lambert, 2h</p>
          <a href="#" className="text-blue-600">Voir les messages →</a>
        </div>
      </div>

      {/* Suivi santé */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Suivi de santé</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tension artérielle</p>
            <p className="text-lg font-bold">{health.tension || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Poids (kg)</p>
            <p className="text-lg font-bold">{health.poids || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Température</p>
            <p className="text-lg font-bold">{health.temperature || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Prochains rendez-vous */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Prochains rendez-vous</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">DATE</th>
              <th className="p-2 text-left">MÉDECIN</th>
              <th className="p-2 text-left">SERVICE</th>
              <th className="p-2 text-left">STATUT</th>
              <th className="p-2 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{appointment.date}</td>
                <td className="p-2">{appointment.medecin}</td>
                <td className="p-2">{appointment.service}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${appointment.statut === 'Confirmé'
                      ? 'bg-green-100 text-green-600'
                      : appointment.statut === 'En attente'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {appointment.statut}
                  </span>
                </td>
                <td className="p-2">
                  <button className="text-blue-600">Modifier</button>
                  <button className="text-blue-600 ml-2">Annuler</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Messages récents */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Messages récents</h3>
        {messages.map((message, index) => (
          <div key={index} className="border-b p-2">
            <p className="font-semibold">{message.sender}</p>
            <p className="text-gray-600">{message.content}</p>
          </div>
        ))}
        <a href="#" className="text-blue-600">Voir tout →</a>
      </div>

      {/* Actualités santé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Prévention des maladies cardiaques</h3>
          <p className="text-gray-600">10 mars 2025</p>
          <p>Découvrez les dernières recommandations pour maintenir votre cœur en bonne santé.</p>
          <a href="#" className="text-blue-600">Lire l'article →</a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Alimentation équilibrée</h3>
          <p className="text-gray-600">8 mars 2025</p>
          <p>Comment adapter son alimentation pour éviter les problèmes de santé.</p>
          <a href="#" className="text-blue-600">Lire l'article →</a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Importance du sommeil</h3>
          <p className="text-gray-600">5 mars 2025</p>
          <p>Les effets du bon sommeil sur votre santé physique et mentale.</p>
          <a href="#" className="text-blue-600">Lire l'article →</a>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;