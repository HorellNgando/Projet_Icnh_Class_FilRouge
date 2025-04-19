// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axios from 'axios';

// const PatientBilling = () => {
//   const [factures, setFactures] = useState([]);

//   useEffect(() => {
//     const fetchFactures = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/patient/factures', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setFactures(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des factures:', error);
//       }
//     };
//     fetchFactures();
//   }, []);

//   const handlePayment = async (id) => {
//     try {
//       await axios.post(
//         `http://localhost:8000/api/patient/factures/${id}/pay`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setFactures(
//         factures.map((facture) =>
//           facture.id === id ? { ...facture, statut: 'payée' } : facture
//         )
//       );
//     } catch (error) {
//       console.error('Erreur lors du paiement:', error);
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar role="patient" />
//       <div className="ml-64 p-6 w-full">
//         <h1 className="text-3xl font-bold mb-6">Paiements & Factures</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3">Numéro de facture</th>
//                 <th className="p-3">Montant</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Statut</th>
//                 <th className="p-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {factures.map((facture, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="p-3">{facture.id_facture}</td>
//                   <td className="p-3">{facture.montant} XAF</td>
//                   <td className="p-3">{facture.date_emission}</td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded ${
//                         facture.statut === 'payée'
//                           ? 'bg-green-100 text-green-600'
//                           : 'bg-red-100 text-red-600'
//                       }`}
//                     >
//                       {facture.statut}
//                     </span>
//                   </td>
//                   <td className="p-3">
//                     {facture.statut === 'en attente' && (
//                       <button
//                         onClick={() => handlePayment(facture.id_facture)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                       >
//                         Payer
//                       </button>
//                     )}
//                     <button className="ml-2 text-blue-600 hover:underline">Télécharger</button>
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

// export default PatientBilling;