// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const PatientHealthTracking = () => {
//   const [healthData, setHealthData] = useState([]);

//   useEffect(() => {
//     const fetchHealthData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/patient/health-tracking', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setHealthData(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données de santé:', error);
//       }
//     };
//     fetchHealthData();
//   }, []);

//   const chartData = {
//     labels: healthData.map((data) => data.date),
//     datasets: [
//       {
//         label: 'Tension artérielle (mmHg)',
//         data: healthData.map((data) => data.tension),
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: false,
//       },
//       {
//         label: 'Poids (kg)',
//         data: healthData.map((data) => data.poids),
//         borderColor: 'rgba(153, 102, 255, 1)',
//         backgroundColor: 'rgba(153, 102, 255, 0.2)',
//         fill: false,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Suivi de santé' },
//     },
//   };

//   return (
//     <div className="flex">
//       <Sidebar role="patient" />
//       <div className="ml-64 p-6 w-full">
//         <h1 className="text-3xl font-bold mb-6">Suivi de Santé</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <Line data={chartData} options={chartOptions} />
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4">Historique de Santé</h2>
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Tension (mmHg)</th>
//                 <th className="p-3">Poids (kg)</th>
//                 <th className="p-3">Notes</th>
//               </tr>
//             </thead>
//             <tbody>
//               {healthData.map((data, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="p-3">{data.date}</td>
//                   <td className="p-3">{data.tension}</td>
//                   <td className="p-3">{data.poids}</td>
//                   <td className="p-3">{data.notes}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientHealthTracking;