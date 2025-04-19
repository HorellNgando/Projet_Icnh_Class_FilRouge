import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaRegCalendar } from 'react-icons/fa';

const Services = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mt-32 mx-6 sm:mx-0">Nos services médicaux</h1>
        <br /><p className="text-center text-gray-600 mb-8 mx-6 sm:mx-0">
          Découvrez notre large gamme de services médicaux conçus pour répondre à tous vos besoins de santé  <br /> avec une qualité et un professionnalisme exemplaires.
        </p>

        {/* Liste des services médicaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-6 sm:mx-0">

          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1.5">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/consultation icon.png" alt="consultation icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Consultations Médicales</h3>
            <p className="text-gray-600 mt-2">Consultations générales et spécialisées avec nos médecins experts pour tous types de pathologies.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1.5">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/urgence icon.png" alt="urgence icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Urgences 24/7</h3>
            <p className="text-gray-600 mt-2">Service d'urgence disponible 24h/24 et 7j/7 pour tous types de situations médicales urgentes.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1.5">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/pediatrie icon.png" alt="pediatrie icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Pédiatrie</h3>
            <p className="text-gray-600 mt-2">Soins spécialisés pour les enfants de tous âges dans un environnement adapté et rassurant.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1.5">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/maternité icon.png" alt="maternité icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Maternité & Gynécologie</h3>
            <p className="text-gray-600 mt-2">Suivi de grossesse, accouchement et soins néonatals dans un environnement sécurisé et confortable.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1.5">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/labo icon.png" alt="labo icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Analyses & Laboratoires</h3>
            <p className="text-gray-600 mt-2">Tests sanguins, diagnostics biologiques et analyses médicales avec des résultats rapides et précis.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1.5">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/soins intensifs icon.png" alt="soins intensifs icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Soins Intensifs</h3>
            <p className="text-gray-600 mt-2">Unité de soins intensifs équipée des technologies les plus avancées pour les cas critiques.</p>
          </div>

        </div>
      </div>

      {/* Services complémentaires */}
      <div className="bg-gray-50 pb-6">
        <div className="max-w-6xl mx-auto py-5">
          <h2 className="text-3xl font-bold text-center mt-10 mb-6 mx-6 sm:mx-0">Services Complémentaires</h2>
          <div className="mt-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-6 sm:mx-0">

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/pharmacie icon.png" alt="pharmacie icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Pharmacie Hospitalière</h3>
              <p className="text-gray-600 mt-2">Médicaments et produits de santé disponibles sur place avec conseils pharmaceutiques.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/vaccination icon.png" alt="vaccination icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Vaccination & Prévention</h3>
              <p className="text-gray-600 mt-2">Services de vaccination et programmes de prévention pour tous les âges.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/medecin travail icon.png" alt="medecin travail icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Médecine du Travail</h3>
              <p className="text-gray-600 mt-2">Examens médicaux professionnels et conseils pour la santé au travail.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/nutrition icon.png" alt="nutrition icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Bien-être & Nutrition</h3>
              <p className="text-gray-600 mt-2">Conseils nutritionnels et programmes de bien-être personnalisés.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-10">
        {/* Informations pratiques */}
        <h2 className="text-3xl font-bold text-center mt-10 mb-6 mx-6 sm:mx-0">Informations Pratiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-6 sm:mx-0">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-black text-2xl font-bold">Horaires de consultation</h3>
            <p className="text-gray-600 mt-6">Consultations générales : Lundi au Vendredi, 8h-18h</p>
            <p className="text-gray-600 mt-2">Consultations spécialisées : Sur rendez-vous</p>
            <p className="text-gray-600 mt-2">Urgences : 24/7</p>
            <p className="text-gray-600 mt-2">Laboratoire d’analyses : Lundi au Samedi, 7h-19h</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-black text-2xl font-bold">Modalités de prise de rendez-vous</h3>
            <p className="text-gray-600 mt-6">En ligne : Via notre plateforme de réservation</p>
            <p className="text-gray-600 mt-2">Par téléphone : 698 819 573</p>
            <p className="text-gray-600 mt-2">Sur place : À l’accueil de l’hôpital</p>

            <button className="mt-4 bg-white rounded-lg border border-blue-600 text-blue-600 px-4 py-1 hover:bg-blue-700 hover:text-white flex items-center">
              Prendre rendez-vous <FaRegCalendar className="ml-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;