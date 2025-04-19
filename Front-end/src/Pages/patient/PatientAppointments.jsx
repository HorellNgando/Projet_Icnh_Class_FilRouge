// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axios from 'axios';

// const PatientAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [newAppointment, setNewAppointment] = useState({
//     date_heure: '',
//     service: '',
//     id_medecin: '',
//   });
//   const [doctors, setDoctors] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const appointmentsResponse = await axios.get('http://localhost:8000/api/patient/appointments', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setAppointments(appointmentsResponse.data);

//         const doctorsResponse = await axios.get('http://localhost:8000/api/doctors');
//         setDoctors(doctorsResponse.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:8000/api/patient/appointments', newAppointment, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setAppointments([...appointments, newAppointment]);
//       setNewAppointment({ date_heure: '', service: '', id_medecin: '' });
//     } catch (error) {
//       console.error('Erreur lors de la prise de rendez-vous:', error);
//     }
//   };

//   const handleChange = (e) => {
//     setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="flex">
//       <Sidebar role="patient" />
//       <div className="ml-64 p-6 w-full">
//         <h1 className="text-3xl font-bold mb-6">Mes Rendez-vous</h1>

//         {/* Formulaire de prise de rendez-vous */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <h2 className="text-xl font-bold mb-4">Prendre un nouveau rendez-vous</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700">Date et heure</label>
//               <input
//                 type="datetime-local"
//                 name="date_heure"
//                 value={newAppointment.date_heure}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Service</label>
//               <select
//                 name="service"
//                 value={newAppointment.service}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               >
//                 <option value="">Sélectionnez un service</option>
//                 <option value="Cardiologie">Cardiologie</option>
//                 <option value="Neurologie">Neurologie</option>
//                 <option value="Chirurgie">Chirurgie</option>
//                 <option value="Pédiatrie">Pédiatrie</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700">Médecin</label>
//               <select
//                 name="id_medecin"
//                 value={newAppointment.id_medecin}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               >
//                 <option value="">Sélectionnez un médecin</option>
//                 {doctors.map((doctor) => (
//                   <option key={doctor.id} value={doctor.id}>
//                     {doctor.nom} {doctor.prenom} - {doctor.departement}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
//               Confirmer le rendez-vous
//             </button>
//           </form>
//         </div>

//         {/* Liste des rendez-vous */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4">Mes rendez-vous</h2>
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Médecin</th>
//                 <th className="p-3">Service</th>
//                 <th className="p-3">Statut</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.map((appointment, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="p-3">{appointment.date_heure}</td>
//                   <td className="p-3">{appointment.medecin}</td>
//                   <td className="p-3">{appointment.service}</td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded ${
//                         appointment.statut === 'Confirmé'
//                           ? 'bg-green-100 text-green-600'
//                           : 'bg-yellow-100 text-yellow-600'
//                       }`}
//                     >
//                       {appointment.statut}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientAppointments;