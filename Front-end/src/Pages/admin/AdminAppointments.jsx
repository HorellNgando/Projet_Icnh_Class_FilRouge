import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/appointments/${id}`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, statut: newStatus } : appointment
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Gestion des rendez-vous</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Patient</th>
                <th className="p-3">Médecin</th>
                <th className="p-3">Date</th>
                <th className="p-3">Service</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{appointment.patient}</td>
                  <td className="p-3">{appointment.medecin}</td>
                  <td className="p-3">{appointment.date_heure}</td>
                  <td className="p-3">{appointment.service}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        appointment.statut === 'confirmé'
                          ? 'bg-green-100 text-green-600'
                          : appointment.statut === 'en attente'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {appointment.statut}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={appointment.statut}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="confirmé">Confirmer</option>
                      <option value="en attente">En attente</option>
                      <option value="annulé">Annuler</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;