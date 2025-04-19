import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Team = () => {
  const [staff, setStaff] = useState({ medecins: [], infirmiers: [] });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/staff');
        const medecins = response.data.filter((member) => member.role === 'medecin');
        const infirmiers = response.data.filter((member) => member.role === 'infirmier');
        setStaff({ medecins, infirmiers });
      } catch (error) {
        console.error('Erreur lors de la récupération du personnel:', error);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6 animate-fadeIn">Notre Équipe Médicale</h1>
        <p className="text-center text-gray-600 mb-8">
          Rencontrez nos médecins et infirmiers experts, dévoués à offrir des soins de qualité et une prise en charge personnalisée.
        </p>

        {/* Médecins */}
        <div className="mb-10 animate-slideUp">
          <h2 className="text-2xl font-bold mb-6">Médecins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.medecins.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
                <img
                  src={member.photo || '/images/default-doctor.jpg'}
                  alt={member.nom}
                  className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
                />
                <h3 className="text-xl font-semibold mt-4">{member.nom} {member.prenom}</h3>
                <p className="text-gray-600">{member.departement}</p>
                <p className="text-gray-600 mt-2">{member.description}</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-transform transform hover:scale-105">
                  Prendre rendez-vous
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Infirmiers */}
        <div className="mb-10 animate-slideUp">
          <h2 className="text-2xl font-bold mb-6">Infirmiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.infirmiers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
                <img
                  src={member.photo || '/images/default-nurse.jpg'}
                  alt={member.nom}
                  className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
                />
                <h3 className="text-xl font-semibold mt-4">{member.nom} {member.prenom}</h3>
                <p className="text-gray-600">{member.departement}</p>
                <p className="text-gray-600 mt-2">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message de confiance */}
        <div className="text-center mt-10 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4">Votre santé entre de bonnes mains</h2>
          <p className="text-gray-600">
            Notre équipe est composée de professionnels qualifiés et passionnés, prêts à vous accompagner à chaque étape de votre parcours de santé.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Team;