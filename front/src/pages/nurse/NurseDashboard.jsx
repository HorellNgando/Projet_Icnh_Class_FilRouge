import React from 'react';
import { FaClipboardList, FaUserNurse, FaBell, FaPlus, FaHeartbeat, FaEnvelope } from 'react-icons/fa';

const NurseDashboard = () => {
  // Mock data
  const user = { name: 'Infirmier(e) Julie Bernard' };
  const todayTasks = 5;
  const patientsToMonitor = 3;
  const alerts = 2;
  const tasks = [
    { time: '08:00', task: 'Prise de tension', patient: 'Marie Dupont', status: 'À faire' },
    { time: '09:00', task: 'Injection', patient: 'Thomas Martin', status: 'Fait' },
  ];
  const patients = [
    { name: 'Sophie Leroy', room: '305', status: 'Critique' },
    { name: 'Paul Petit', room: '210', status: 'Stable' },
  ];
  const messages = [
    { from: 'Dr. Claire Moreau', time: 'il y a 30 min', content: 'Merci pour la surveillance du patient Leroy.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-3xl shadow-lg px-8 py-8 flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Bienvenue, {user.name}</h1>
          <p className="text-white text-opacity-80">Bonne tournée aujourd'hui.</p>
        </div>
        <button className="mt-6 md:mt-0 flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-50 transition-all duration-200">
          <FaPlus /> Nouvelle tâche
        </button>
      </div>

      {/* Cartes accès rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaClipboardList className="text-blue-400 text-2xl" />
            <span className="font-semibold text-gray-700">Tâches du jour</span>
          </div>
          <div className="text-gray-700 font-medium">{todayTasks}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaUserNurse className="text-green-400 text-2xl" />
            <span className="font-semibold text-gray-700">Patients à surveiller</span>
          </div>
          <div className="text-gray-700 font-medium">{patientsToMonitor}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaBell className="text-yellow-400 text-2xl" />
            <span className="font-semibold text-gray-700">Alertes</span>
          </div>
          <div className="text-gray-700 font-medium">{alerts}</div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="bg-white rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold tracking-wide">Tâches du jour</div>
        </div>
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">HEURE</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">TÂCHE</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">PATIENT</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">STATUT</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tasks.map((t, i) => (
              <tr key={i} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap font-medium">{t.time}</td>
                <td className="px-4 py-2 whitespace-nowrap">{t.task}</td>
                <td className="px-4 py-2 whitespace-nowrap">{t.patient}</td>
                <td className="px-4 py-2 whitespace-nowrap">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bloc patients sous surveillance */}
      <div className="bg-white rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0">
        <div className="text-lg font-semibold tracking-wide mb-4">Patients sous surveillance</div>
        <ul>
          {patients.map((p, i) => (
            <li key={i} className="mb-2">{p.name} (Chambre {p.room}) <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'Critique' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{p.status}</span></li>
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

export default NurseDashboard; 