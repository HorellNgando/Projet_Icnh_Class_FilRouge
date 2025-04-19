// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axios from 'axios';

// const AdminMedicalRecords = () => {
//   const [records, setRecords] = useState([]);

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/admin/medical-records', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setRecords(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des dossiers:', error);
//       }
//     };
//     fetchRecords();
//   }, []);

//   const handleDownload = (fichierUrl) => {
//     window.open(fichierUrl, '_blank');
//   };

//   return (
//     <div className="flex">
//       <Sidebar role="admin" />
//       <div className="ml-64 p-6 w-full">
//         <h1 className="text-3xl font-bold mb-6">Gestion des dossiers médicaux</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3">Patient</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Diagnostics</th>
//                 <th className="p-3">Prescriptions</th>
//                 <th className="p-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((record, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="p-3">{record.patient}</td>
//                   <td className="p-3">{record.date_creation}</td>
//                   <td className="p-3">{record.diagnostics}</td>
//                   <td className="p-3">{record.prescriptions}</td>
//                   <td className="p-3">
//                     <button
//                       onClick={() => handleDownload(record.fichier_url)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Télécharger (PDF)
//                     </button>
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

// export default AdminMedicalRecords;