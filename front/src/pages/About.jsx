import React from 'react';
import Navbar from '../components/vitrine/Navbar';
import Footer from '../components/vitrine/Footer';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 ">
        <h1 className="text-4xl font-bold text-center mt-32 mx-6 sm:mx-0">À Propos de Nous</h1>
        <p className="text-center text-gray-600 mt-3 mx-6 sm:mx-0">
          Découvrez la clinique de Bali du Dr Wondje, un établissement dédié à votre bien-être, offrant des soins de qualité et<br /> une prise en charge humaine et innovante.
        </p>

        {/* Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 items-center mx-6 sm:mx-0">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">Bienvenue à la Clinique du <br />Dr Wondje</h2>
            <p className="text-gray-600 mt-2">
              La Clinique du Dr Wondje est un établissement médical de premier plan, offrant une gamme complète de services de santé pour répondre aux besoins de notre communauté. Notre mission est de fournir des soins médicaux exceptionnels dans un environnement accueillant et rassurant.
              Avec une équipe de professionnels dévoués et des équipements de pointe, nous nous engageons à offrir le meilleur service à nos patients, en plaçant leur bien-être et leur santé au cœur de nos préoccupations.
            </p>
            <div className="flex space-x-5 mt-5">
              <button className="mt-4 bg-white rounded-lg border border-blue-600 text-blue-600 px-6 py-1 hover:bg-blue-700 hover:text-white flex items-center">
                <a href="/services">Nos services </a>
              </button>
              <button className="mt-4 hover:bg-white rounded-lg border hover:border-blue-600 hover:text-blue-600 px-4 py-1 bg-blue-700 text-white flex items-center">
                <a href="/contact">Nous contacter</a>
              </button>
            </div>
          </div>
          <div className="rounded-lg">
            <img src="/images/team equipe.png" alt="Équipe médicale" className="w-full h-auto object-cover rounded-lg" />
          </div>
        </div>

        {/* Historique & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 bg-blue-100 p-8 rounded-lg mx-6 sm:mx-0">
          <div>
            <h2 className="text-black text-2xl font-bold mb-4">Notre Historique</h2>
            <p className="text-gray-600">
              Fondé en 1995, la clinique du Dr Wondje a commencé comme une petite clinique avec seulement 20 lits. Au fil des années, nous avons connu une croissance significative, devenant l'un des établissements médicaux les plus respectés de la région.
              En 2005, nous avons inauguré notre nouveau bâtiment ultramoderne, augmentant notre capacité à 200 lits et intégrant les technologies médicales les plus avancées. En 2015, nous avons ouvert notre centre de recherche médicale, renforçant notre engagement envers l'innovation et l'excellence médicale.
            </p>
          </div>
          <div>
            <h2 className="text-black text-2xl font-bold mb-4">Notre Mission</h2>
            <p className="text-gray-600">
              Notre mission est de fournir des soins médicaux de la plus haute qualité, accessibles à tous, dans un environnement qui favorise la guérison et le bien-être. Nous nous engageons à traiter chaque patient avec dignité, respect et compassion.
              Nous visons également à être à la pointe de l'innovation médicale, en investissant dans la recherche et les nouvelles technologies pour améliorer constamment nos services et contribuer à l'avancement de la médecine.
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <h2 className="text-3xl font-bold text-center mt-20 mb-6 mx-6 sm:mx-0">Nos Valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-6 sm:mx-0">

          <div className="bg-white p-6 rounded-lg shadow-md justify-items-center text-center">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/humanité icon.png" alt="humanité icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Humanité</h3>
            <p className="text-gray-600 mt-2">Un accompagnement personnalisé et bienveillant pour chaque patient.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md justify-items-center text-center">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/excellence icon.png" alt="excellence icon" className="h-12" />
            </div>
            <h3 className="text-xl font-bold mt-3">Excellence</h3>
            <p className="text-gray-600 mt-2">Des soins de pointe avec des équipements modernes et des professionnels qualifiés.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md justify-items-center text-center">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/innovation icon.png" alt="innovation icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Innovation</h3>
            <p className="text-gray-600 mt-2">Investissement continu dans la recherche et les technologies médicales avancées.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md justify-items-center text-center">
            <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
              <img src="/images/ethique icon.png" alt="ethique icon" className="h-10" />
            </div>
            <h3 className="text-xl font-bold mt-3">Éthique</h3>
            <p className="text-gray-600 mt-2">Respect des patients, confidentialité et intégrité dans toutes nos actions.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 pb-10">
        <div className="max-w-6xl mx-auto py-2 ">
          {/* Équipe médicale */}
          <h2 className="text-3xl font-bold text-center mt-10 mb-6 mx-6 sm:mx-0">Notre Équipe Médicale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/docteur 2.png"
                alt="Dr Jean Dubols"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Dr Jean Dubols</h3>
              <p className="text-blue-600 font-semibold">Directeur Médical, Cardiologie</p>
              <p className="text-gray-600 mt-4">Le Dr. Dubois dirige notre équipe médicale avec plus de 25 ans d'expérience en cardiologie. Il est reconnu pour ses contributions à la recherche sur les maladies cardiaques.</p>
            </div>

            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/docteur femme.png"
                alt="Dr Claire Moreau"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Dr Claire Moreau</h3>
              <p className="text-blue-600 font-semibold">Chef du Service de Neurologie</p>
              <p className="text-gray-600 mt-4">Spécialiste renommée en neurologie, le Dr. Moreau a rejoint notre équipe en 2010 après avoir travaillé dans plusieurs hôpitaux prestigieux en Europe et aux États-Unis.</p>
            </div>

            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/docteur 1.png"
                alt="Dr Michel Lambert"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Dr Michel Lambert</h3>
              <p className="text-blue-600 font-semibold">Chef du Service de Chirurgie</p>
              <p className="text-gray-600 mt-4">Avec plus de 1000 interventions chirurgicales réussies, le Dr. Lambert est l'un des chirurgiens les plus expérimentés de notre établissement.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 ">
        {/* Infrastructure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 mx-6 sm:mx-0">
          <div>
            <img src="/images/installation 2.png" alt="Infrastructure" className="w-full h-96 object-cover rounded-lg" />
          </div>
          <div className="mt-8 ml-5">
            <h2 className="text-3xl font-bold mb-4">Notre Infrastructure</h2>
            <div className="space-y-4">
              <div className="flex space-x-5 items-center">
                <img src="/images/icons8-medicine-50 1.png" alt="icons8-medicine-50 1" className="h-6" />
                <p className="text-gray-600">Bloc opératoire de pointe avec 2 salles d'opération</p>
              </div>

              <div className="flex space-x-5 items-center">
                <img src="/images/icons8-medicine-50 1.png" alt="icons8-medicine-50 1" className="h-6" />
                <p className="text-gray-600">Laboratoire d'analyses médicales avancé</p>
              </div>

              <div className="flex space-x-5 items-center">
                <img src="/images/icons8-medicine-50 1.png" alt="icons8-medicine-50 1" className="h-6" />
                <p className="text-gray-600">Unité de soins maternels pour suivi prénatal et postnatal</p>
              </div>

              <div className="flex space-x-5 items-center">
                <img src="/images/icons8-medicine-50 1.png" alt="icons8-medicine-50 1" className="h-6" />
                <p className="text-gray-600">Salle d’observation avec 4 lits pour surveillance à court terme des patients</p>
              </div>

              <div className="flex space-x-5 items-center">
                <img src="/images/icons8-medicine-50 1.png" alt="icons8-medicine-50 1" className="h-6" />
                <p className="text-gray-600">Unité de maternité avec 8 salles d’accouchement et soins néonatals avancés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 mt-10 p-5">
        <div className="max-w-6xl mx-auto py-10 ">
          {/* Chiffres clés */}
          <h2 className="text-3xl font-bold text-center mt-0 mb-6">Chiffres Clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">200+</p>
              <p className="text-gray-600">Patients traités par an</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">200</p>
              <p className="text-gray-600">Lits d’hospitalisation</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">10</p>
              <p className="text-gray-600">Médecins spécialisés</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600">Service d’urgence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="max-w-6xl mx-auto py-10 ">
        <div className="text-center mt-10 bg-blue-600 rounded-lg">
          <div className="max-w-6xl mx-auto py-10 justify-items-center ">
            <h2 className="text-3xl font-bold mb-4 text-white">Prenez rendez-vous aujourd’hui !</h2>
            <p className="text-white mt-3">Notre équipe de professionnels est prête à vous accueillir et à vous offrir les meilleurs soins médicaux.</p>
            <div className="flex space-x-5 mt-5">
              <button className="mt-4 bg-white rounded-lg border hover:border-white text-blue-600 px-6 py-1 hover:bg-blue-700 hover:text-white flex items-center">
                <a href="/services">Nos services </a>
              </button>
              <button className="mt-4 hover:bg-white rounded-lg border hover:border-blue-600 hover:text-blue-600 px-4 py-1 bg-blue-700 text-white flex items-center">
                <a href="/contact">Nous contacter</a>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />

    </div>
  );
};

export default About;