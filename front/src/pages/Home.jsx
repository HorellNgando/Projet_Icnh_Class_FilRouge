import React, { useEffect, useState } from 'react';
import Navbar from '../components/vitrine/Navbar';
import Footer from '../components/vitrine/Footer';
import Slider from 'react-slick'; // Carrousel
import 'slick-carousel/slick/slick.css'; // Styles pour le carrousel
import 'slick-carousel/slick/slick-theme.css'; // Thème du carrousel
import axios from 'axios';
import { FaPhoneAlt, FaAmbulance, FaRegCalendar  } from 'react-icons/fa'; // Icônes pour les boutons
import { IoMdMail } from "react-icons/io";
import { GiPositionMarker } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEFAULT_TESTIMONIALS = [
  {
    nom: 'Marie Dupont',
    message: 'Accueil chaleureux, équipe très professionnelle. Je recommande vivement ce centre médical.',
    etoiles: 5,
    photo: '/images/default-user.jpg',
  },
  {
    nom: 'Thomas Martin',
    message: "Des médecins à l'écoute et un suivi irréprochable. Merci pour votre accompagnement !",
    etoiles: 5,
    photo: '/images/default-user.jpg',
  },
  {
    nom: 'Sophie Leray',
    message: "Service d'urgence très réactif, prise en charge rapide et efficace.",
    etoiles: 5,
    photo: '/images/default-user.jpg',
  },
];

const Home = () => {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('/api/testimonials');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTestimonials(response.data);
        }
      } catch (error) {
        // On garde les témoignages par défaut
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

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      {/* Hero Section avec animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-blue-600 text-white text-center pt-24"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center py-10 px-4 md:py-10 md:px-6">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
          >
            <h1 className="text-4xl font-bold">Votre santé, notre priorité</h1>
            <p className="mt-4 text-lg">
              Un hôpital moderne au service de votre bien-être
            </p>
            <div className="mt-6 space-x-4 flex">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-100"
              >
                <FaPhoneAlt className="mr-2" />
                Prendre rendez-vous
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-blue-600"
              >
                <FaAmbulance className="mr-2" />
                Contact urgences
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <img
              src="/images/docteur 1.png"
              alt="Hôpital"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Présentation rapide avec animations */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto py-10"
      >
        <motion.h2 variants={itemAnimation} className="mx-6 sm:mx-0 text-3xl font-bold text-center mb-6">
          Un hôpital moderne au service de votre bien-être
        </motion.h2>
        <motion.p variants={itemAnimation} className="mx-6 sm:mx-0 text-center text-gray-600 mb-8">
          La Clinique de Bali, dirigée par le Dr Wondje, s'engage à fournir des soins médicaux exceptionnels dans un environnement accueillant et rassurant.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center h-40">
          {[
            { number: "5", text: "Médecins spécialistes" },
            { number: "200", text: "Patients traités par an" },
            { number: "3", text: "Services spécialisés" },
            { number: "24/7", text: "Service d'urgence" }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              whileHover={{ scale: 1.05 }}
              className="mx-6 sm:mx-0 bg-blue-100 rounded-lg py-10 items-center space-y-2"
            >
              <motion.p 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-4xl font-bold text-blue-600"
              >
                {item.number}
              </motion.p>
              <p className="text-gray-600 text-xl font-semibold">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Services principaux avec animations */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-50 py-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mx-6 sm:mx-0 text-3xl font-bold text-center mb-6"
          >
            Nos services médicaux
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: "/images/consultation icon.png",
                title: "Consultations",
                description: "Consultations générales et spécialisées avec nos médecins experts"
              },
              {
                icon: "/images/urgence icon.png",
                title: "Urgences",
                description: "Disponible 24h/24 et 7j/7 pour tous types de situations"
              },
              {
                icon: "/images/chirurgie icon.png",
                title: "Chirurgie",
                description: "Interventions chirurgicales avec des équipements de pointe"
              },
              {
                icon: "/images/radiologie icon.png",
                title: "Radiologie",
                description: "Examens d'imagerie médicale (IRM, scanner, radiographie)"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="mx-6 sm:mx-0 bg-white p-6 rounded-lg shadow-md"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center mx-auto"
                >
                  <img src={service.icon} alt={`${service.title} icon`} className="h-10" />
                </motion.div>
                <h3 className="text-xl font-bold mt-3 text-center">{service.title}</h3>
                <p className="text-gray-600 mt-2 text-center">{service.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center mt-8"
          >
            <Link to="/services">
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                Voir plus
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Témoignages avec animations */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto py-10 px-4"
      >
        <motion.h2 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mx-6 sm:mx-0 font-bold text-center mb-6"
        >
          Ce que disent nos patients
        </motion.h2>
        <Slider {...settings}>
          {Array.isArray(testimonials) && testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-4"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={testimonial.photo || '/images/default-user.jpg'}
                  alt={testimonial.nom}
                  className="h-16 w-16 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 italic text-center">"{testimonial.message}"</p>
                <p className="mt-2 font-semibold text-center">{testimonial.nom}</p>
                <div className="flex justify-center mt-2">
                  {[...Array(testimonial.etoiles)].map((_, i) => (
                    <motion.svg
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L0 6.91l6.56-.957L10 0l3.44 5.953L20 6.91l-5.244 4.635L15.878 18z" />
                    </motion.svg>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </Slider>
      </motion.div>

      {/* Équipe médicale avec animations */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-50 py-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-6"
          >
            Notre équipe médicale
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                image: "/images/docteur 2.png",
                name: "Dr Jean Dubols",
                specialty: "Cardiologue"
              },
              {
                image: "/images/docteur femme.png",
                name: "Dr Claire Moreau",
                specialty: "Neurologue"
              },
              {
                image: "/images/docteur 1.png",
                name: "Dr Michel Lambert",
                specialty: "Chirurgien"
              },
              {
                image: "/images/nurse.png",
                name: "Émilie Bernard",
                specialty: "Infirmière"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="mx-6 sm:mx-0 bg-blue-100 p-6 rounded-lg shadow-md text-center"
              >
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={member.image}
                  alt={member.name}
                  className="h-32 w-32 rounded-full mx-auto"
                />
                <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
                <p className="text-blue-600 font-semibold">{member.specialty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

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
                <p className="flex items-center"><FaRegCalendar  className="mr-2 text-blue-600" /><strong>Horaires d'ouverture</strong></p>
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