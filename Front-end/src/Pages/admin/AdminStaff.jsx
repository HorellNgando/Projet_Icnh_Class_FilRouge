// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axios from 'axios';

// const AdminStaff = () => {
//   const [staff, setStaff] = useState([]);

//   useEffect(() => {
//     const fetchStaff = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/admin/staff', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setStaff(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération du personnel:', error);
//       }
//     };
//     fetchStaff();
//   }, []);

//   return (
//     <div className="flex">
//       <Sidebar role="admin" />
//       <div className="ml-64 p-6 w-full">
//         <h1 className="text-3xl font-bold mb-6">Gestion du personnel</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3">Nom</th>
//                 <th className="p-3">Rôle</th>
//                 <th className="p-3">Département</th>
//                 <th className="p-3">Statut</th>
//                 <th className="p-3">Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {staff.map((member, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="p-3">{member.nom} {member.prenom}</td>
//                   <td className="p-3">{member.role}</td>
//                   <td className="p-3">{member.departement}</td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded ${
//                         member.statut === 'actif'
//                           ? 'bg-green-100 text-green-600'
//                           : member.statut === 'en congé'
//                           ? 'bg-yellow-100 text-yellow-600'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {member.statut}
//                     </span>
//                   </td>
//                   <td className="p-3">{member.type}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminStaff;