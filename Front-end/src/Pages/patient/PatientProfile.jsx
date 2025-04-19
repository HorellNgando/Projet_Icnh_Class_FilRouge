// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../components/Sidebar';
// import axios from 'axios';

// const PatientProfile = () => {
//   const [profile, setProfile] = useState({
//     nom: '',
//     prenom: '',
//     email: '',
//     telephone: '',
//     date_naissance: '',
//     groupe_sanguin: '',
//     allergies: '',
//     antecedents_medicaux: '',
//     contact_urgence: '',
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/patient/profile', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setProfile(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération du profil:', error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put('http://localhost:8000/api/patient/profile', profile, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       alert('Profil mis à jour avec succès !');
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du profil:', error);
//     }
//   };

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="flex">
//       <Sidebar role="patient" />
//       <div className="ml-64 p-6 w-full">
//         <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700">Nom</label>
//                 <input
//                   type="text"
//                   name="nom"
//                   value={profile.nom}
//                   onChange={handleChange}
//                   className="border p-3 rounded w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700">Prénom</label>
//                 <input
//                   type="text"
//                   name="prenom"
//                   value={profile.prenom}
//                   onChange={handleChange}
//                   className="border p-3 rounded w-full"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profile.email}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Téléphone</label>
//               <input
//                 type="text"
//                 name="telephone"
//                 value={profile.telephone}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Date de naissance</label>
//               <input
//                 type="date"
//                 name="date_naissance"
//                 value={profile.date_naissance}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Groupe sanguin</label>
//               <input
//                 type="text"
//                 name="groupe_sanguin"
//                 value={profile.groupe_sanguin}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Allergies</label>
//               <textarea
//                 name="allergies"
//                 value={profile.allergies}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               ></textarea>
//             </div>
//             <div>
//               <label className="block text-gray-700">Antécédents médicaux</label>
//               <textarea
//                 name="antecedents_medicaux"
//                 value={profile.antecedents_medicaux}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               ></textarea>
//             </div>
//             <div>
//               <label className="block text-gray-700">Contact d’urgence</label>
//               <input
//                 type="text"
//                 name="contact_urgence"
//                 value={profile.contact_urgence}
//                 onChange={handleChange}
//                 className="border p-3 rounded w-full"
//               />
//             </div>
//             <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
//               Mettre à jour
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientProfile;