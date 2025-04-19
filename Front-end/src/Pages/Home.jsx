import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Slider from 'react-slick'; // Carrousel
import 'slick-carousel/slick/slick.css'; // Styles pour le carrousel
import 'slick-carousel/slick/slick-theme.css'; // Thème du carrousel
import axios from 'axios';
import { FaPhoneAlt, FaAmbulance, FaRegCalendar  } from 'react-icons/fa'; // Icônes pour les boutons
import { IoMdMail } from "react-icons/io";
import { GiPositionMarker } from "react-icons/gi";
import { Link } from 'react-router-dom';

const Home = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('/api/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des témoignages:', error);
      }
    };
    fetchTestimonials();
  }, []);


  // Paramètres du carrousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white text-center animate-fadeIn d-flex flex-row pt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center py-10 px-4 md:py-10 md:px-6">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl font-bold">Votre santé, notre priorité</h1>
            <p className="mt-4 text-lg">
              Un hôpital moderne au service de votre bien-être
            </p>
            <div className="mt-6 space-x-4 flex">
              <button className="flex items-center bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-100 transition-transform transform hover:scale-105">
                <FaPhoneAlt className="mr-2" />
                Prendre rendez-vous
              </button>
              <button className="flex items-center border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-blue-600 transition-transform transform hover:scale-105">
                <FaAmbulance className="mr-2" />
                Contact urgences
              </button>
            </div>
          </div>
          {/* Image à droite */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/docteur 1.png"
              alt="Hôpital"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Présentation rapide */}
      <div className="max-w-6xl mx-auto py-10 animate-slideUp">
        <h2 className="mx-6 sm:mx-0 text-3xl font-bold text-center mb-6">Un hôpital moderne au service de votre bien-être</h2>
        <p className="mx-6 sm:mx-0 text-center text-gray-600 mb-8">
          La Clinique de Bali, dirigée par le Dr Wondje, s’engage  fournir des soins médicaux exceptionnels dans un environnement accueillant et rassurant. <br /> Avec une équipe de professionnels dévoués et des équipements de pointe, nous nous engageons à offrir le meilleur service à nos patients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center h-40">
          <div className="mx-6 sm:mx-0 animate-bounceIn  bg-blue-100 rounded-lg py-10 items-center space-y-2">
            <p className="text-4xl font-bold text-blue-600">5</p>
            <p className="text-gray-600 text-xl font-semibold">Médécins spécialistes</p>
          </div>
          <div className="mx-6 sm:mx-0 animate-bounceIn bg-blue-100 rounded-lg py-10 items-center space-y-2">
            <p className="text-4xl font-bold text-blue-600">200</p>
            <p className="text-gray-600 text-xl font-semibold">Patients traités par an</p>
          </div>
          <div className="mx-6 sm:mx-0 animate-bounceIn bg-blue-100 rounded-lg py-10 items-center space-y-2">
            <p className="text-4xl font-bold text-blue-600">3</p>
            <p className="text-gray-600 text-xl font-semibold">Services spécialisés</p>
          </div>
          <div className="mx-6 sm:mx-0 animate-bounceIn bg-blue-100 rounded-lg py-10 items-center space-y-2">
            <p className="text-4xl font-bold text-blue-600">24/7</p>
            <p className="text-gray-600 text-xl font-semibold">Service d'urgence</p>
          </div>
        </div>
      </div>

      {/* Services principaux */}
      <div className="bg-gray-50 py-10 animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <h2 className="mx-6 sm:mx-0 text-3xl font-bold text-center mb-6">Nos services médicaux</h2>
          <p className="mx-6 sm:mx-0 text-center text-gray-600 mb-8">
            Découvrez notre large gamme de services pour répondre à tous vos besoins de santé.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/consultation icon.png" alt="consultation icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Consultations</h3>
              <p className="text-gray-600 mt-2">Consultations générales et spécialisées avec nos médecins experts</p>
            </div>
            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/urgence icon.png" alt="urgence icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Urgences</h3>
              <p className="text-gray-600 mt-2">Disponible 24h/24 et 7j/7 pour tous types de situations</p>
            </div>
            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/chirurgie icon.png" alt="chirurgie icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Chirurgie</h3>
              <p className="text-gray-600 mt-2">Interventions chirurgicales avec des équipements de pointe</p>
            </div>
            <div className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center">
                <img src="/images/radiologie icon.png" alt="radiologie icon" className="h-10" />
              </div>
              <h3 className="text-xl font-bold mt-3">Radiologie</h3>
              <p className="text-gray-600 mt-2">Examens d'imagerie médicale (IRM, scanner, , radiographie)
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/services">
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-transform transform hover:scale-105">
                Voir plus
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="max-w-7xl mx-auto py-10 px-4 animate-slideUp">
        <h2 className="mx-6 sm:mx-0 font-bold text-center mb-6">Ce que disent nos patients</h2>
        <p className="mx-6 sm:mx-0 text-center text-gray-600 mb-8">
        Découvrez les témoignages de patients satisfaits de nos services et de notre équipe médicale
        </p>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4">
              <div className="bg-[var(--white)] p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <img
                  src={testimonial.photo || '/images/default-user.jpg'}
                  alt={testimonial.nom}
                  className="h-16 w-16 rounded-full mx-auto mb-4"
                />
                <p className="text-[var(--gray-dark)] italic text-center">"{testimonial.message}"</p>
                <p className="mt-2 font-semibold text-center text-[var(--black)]">{testimonial.nom}</p>
                <div className="flex justify-center mt-2">
                  {[...Array(testimonial.etoiles)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[var(--yellow-star)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.122-6.545L0 6.91l6.56-.957L10 0l3.44 5.953L20 6.91l-5.244 4.635L15.878 18z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Équipe médicale (partielle) */}
      <div className="bg-gray-50 py-10 animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Notre équipe médicale</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="mx-6 sm:mx-0 bg-blue-100 p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/docteur 2.png"
                alt="Dr Jean Dubols"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Dr Jean Dubols</h3>
              <p className="text-blue-600 font-semibold">Cardiologue</p>
            </div>
            <div className="mx-6 sm:mx-0 bg-blue-100 p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/docteur femme.png"
                alt="Dr Claire Moreau"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Dr Claire Moreau</h3>
              <p className="text-blue-600 font-semibold">Neurologue</p>
            </div>
            <div className="mx-6 sm:mx-0 bg-blue-100 p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/docteur 1.png"
                alt="Dr Michel Lambert"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Dr Michel Lambert</h3>
              <p className="text-blue-600 font-semibold">Chirurgien</p>
            </div>
            <div className="mx-6 sm:mx-0 bg-blue-100 p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <img
                src="/images/nurse.png"
                alt="Émilie Bernard"
                className="h-32 w-32 rounded-full mx-auto transition-transform transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold mt-4">Émilie Bernard</h3>
              <p className="text-blue-600 font-semibold">Infirmière</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/team">
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-transform transform hover:scale-105">
                Voir plus
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Actualités & Événements */}
      <div className="max-w-6xl mx-auto py-10 animate-slideUp">
        <h2 className="text-3xl font-bold text-center mb-6">Actualités & Événements</h2>
        <p className="mx-6 sm:mx-0 text-center text-gray-600 mb-8">
          Restez informé des dernières nouvelles et événements de notre hôpital
        </p>
        <div className="mx-6 sm:mx-0 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <img
              src="/images/equipements.png"
              alt="equipements"
              className="h-45 w-full"
            />
            <div className="p-6">
              <p className="text-blue-600">12 Février 2026</p>
              <h3 className="text-xl font-semibold">Nouvelle unité de soins intensifs</h3>
              <p className="text-gray-600 mt-2">Notre hôpital inaugure une nouvelle unité de soins intensifs équipée des technologies les plus avancées.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <img
              src="/images/conference.png"
              alt="conference"
              className="h-45 w-full"
            />
            <div className="p-6">
              <p className="text-blue-600">12 Mars 2025</p>
              <h3 className="text-xl font-semibold">Conférence sur la santé mentale</h3>
              <p className="text-gray-600 mt-2">Nos spécialistes animeront une conférence sur l'importance de la santé mentale et les ressources disponibles.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <img
              src="/images/stage.png"
              alt="stage"
              className="h-45 w-full"
            />
            <div className="p-6">
              <p className="text-blue-600">24 Mars 2026</p>
              <h3 className="text-xl font-semibold">Stage professionnel et académique</h3>
              <p className="text-gray-600 mt-2">Une nouvelle génération au sein de notre établissement. Transmission et apprentissage : Bienvenue à nos stagiaires </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Localisation */}
      <div className="bg-gray-50 py-10 animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Contact & Localisation</h2>
          <p className="mx-6 sm:mx-0 text-center text-gray-600 mb-8">
            Nous sommes facilement accessibles et disponibles pour répondre à toutes vos questions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            <div className="mx-6 sm:mx-0 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold">Informations de contact</h3>
              <div className="mt-6 ml-6">
                <p className="flex"><FaPhoneAlt className="mr-2 text-blue-600 mt-1" /><strong>Téléphone</strong> </p>
                <p className="ml-7">Standard : 698 819 573 <br /> Urgences : 699 552 627</p>
              </div>
              <div className="mt-3 ml-6">
                <p className="flex items-center"><IoMdMail className="mr-2 text-blue-600" /><strong>Email</strong></p>
                <p className="ml-6"> ngandohorell@gmail.com</p>
              </div>
              <div className="mt-3 ml-6">
                <p className="flex items-center"><GiPositionMarker  className="mr-2 text-blue-600" /><strong>Adresse</strong></p>
                <p className="ml-6"> Bali - Après Jamaica, Douala-Cameroun</p>
              </div>
              <div className="mt-3 ml-6">
                <p className="flex items-center"><FaRegCalendar  className="mr-2 text-blue-600" /><strong>Horaires d’ouverture</strong></p>
                <p className="ml-6">Consultations : Lun-Ven, 8h-18h <br /> Urgences : 24/7</p>
              </div>
              <div className="mt-8 font-semibold text-md ml-6">
                <Link to="/contact" className="text-blue-600 hover:underline">Nous contacter</Link>
              </div>
            </div>
            <div className="mx-6 sm:mx-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.693692075123!2d9.704057314769238!3d4.051056297164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDMnMDQuMiJOIDnCsDQyJzE0LjYiRQ!5e0!3m2!1sfr!2sfr!4v1634567891234"
                className="w-full h-full rounded-lg"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;