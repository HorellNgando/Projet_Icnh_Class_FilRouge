import React from 'react';
import { FaCalendarAlt, FaUserPlus, FaEnvelope, FaPlus, FaClipboardList } from 'react-icons/fa';

const SecretaryDashboard = () => {
  // Mock data
  const user = { name: 'Secrétaire Anne Dubois' };
  const appointmentsToPlan = 4;
  const patientsToRegister = 2;
  const unreadMessages = 3;
  const appointments = [
    { date: '16 mars 2025, 09:00', patient: 'Paul Petit', service: 'Pédiatrie', status: 'À planifier' },
    { date: '16 mars 2025, 10:00', patient: 'Julie Martin', service: 'Maternité', status: 'Confirmé' },
  ];
  const adminRequests = [
    { type: 'Attestation', patient: 'Marie Dupont', date: '15 mars 2025', status: 'En attente' },
  ];
  const messages = [
    { from: 'Dr. Michel Lambert', time: 'il y a 1h', content: 'Merci de planifier le rendez-vous de Mme Martin.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-3xl shadow-lg px-8 py-8 flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Bienvenue, {user.name}</h1>
          <p className="text-white text-opacity-80">Bonne organisation aujourd'hui.</p>
        </div>
        <button className="mt-6 md:mt-0 flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-50 transition-all duration-200">
          <FaPlus /> Nouveau rendez-vous
        </button>
      </div>

      {/* Cartes accès rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaCalendarAlt className="text-blue-400 text-2xl" />
            <span className="font-semibold text-gray-700">Rendez-vous à planifier</span>
          </div>
          <div className="text-gray-700 font-medium">{appointmentsToPlan}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaUserPlus className="text-green-400 text-2xl" />
            <span className="font-semibold text-gray-700">Patients à enregistrer</span>
          </div>
          <div className="text-gray-700 font-medium">{patientsToRegister}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaEnvelope className="text-purple-400 text-2xl" />
            <span className="font-semibold text-gray-700">Messages non lus</span>
          </div>
          <div className="text-gray-700 font-medium">{unreadMessages}</div>
        </div>
      </div>

      {/* Liste des rendez-vous à venir */}
      <div className="bg-white rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold tracking-wide">Rendez-vous à venir</div>
        </div>
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">DATE</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">PATIENT</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">SERVICE</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">STATUT</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {appointments.map((a, i) => (
              <tr key={i} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap font-medium">{a.date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{a.patient}</td>
                <td className="px-4 py-2 whitespace-nowrap">{a.service}</td>
                <td className="px-4 py-2 whitespace-nowrap">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bloc demandes administratives */}
      <div className="bg-white rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0">
        <div className="text-lg font-semibold tracking-wide mb-4">Demandes administratives</div>
        <ul>
          {adminRequests.map((r, i) => (
            <li key={i} className="mb-2">{r.type} pour {r.patient} ({r.date}) <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold ml-2">{r.status}</span></li>
          ))}
        </ul>
      </div>

      {/* Messages récents */}
      <div className="bg-blue-50 rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0">
        <div className="text-lg font-semibold tracking-wide mb-4">Messages récents</div>
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="font-semibold text-blue-700 mb-1">{m.from} <span className="text-xs text-gray-400 font-normal">{m.time}</span></div>
              <div className="text-gray-700 text-sm">{m.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard; 