import React from 'react';
import Navbar from '../components/vitrine/Navbar';
import Footer from '../components/vitrine/Footer';
import { FaRegCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Services = () => {
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto py-10"
      >
        <motion.h1 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-3xl font-bold text-center mt-32 mx-6 sm:mx-0"
        >
          Nos services médicaux
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center text-gray-600 mb-8 mx-6 sm:mx-0"
        >
          Découvrez notre large gamme de services médicaux conçus pour répondre à tous vos besoins de santé <br /> avec une qualité et un professionnalisme exemplaires.
        </motion.p>

        {/* Liste des services médicaux */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-6 sm:mx-0"
        >
          {[
            {
              icon: "/images/consultation icon.png",
              title: "Consultations Médicales",
              description: "Consultations générales et spécialisées avec nos médecins experts pour tous types de pathologies."
            },
            {
              icon: "/images/urgence icon.png",
              title: "Urgences 24/7",
              description: "Service d'urgence disponible 24h/24 et 7j/7 pour tous types de situations médicales urgentes."
            },
            {
              icon: "/images/pediatrie icon.png",
              title: "Pédiatrie",
              description: "Soins spécialisés pour les enfants de tous âges dans un environnement adapté et rassurant."
            },
            {
              icon: "/images/maternité icon.png",
              title: "Maternité & Gynécologie",
              description: "Suivi de grossesse, accouchement et soins néonatals dans un environnement sécurisé et confortable."
            },
            {
              icon: "/images/labo icon.png",
              title: "Analyses & Laboratoires",
              description: "Tests sanguins, diagnostics biologiques et analyses médicales avec des résultats rapides et précis."
            },
            {
              icon: "/images/soins intensifs icon.png",
              title: "Soins Intensifs",
              description: "Unité de soins intensifs équipée des technologies les plus avancées pour les cas critiques."
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center"
              >
                <img src={service.icon} alt={`${service.title} icon`} className="h-10" />
              </motion.div>
              <h3 className="text-xl font-bold mt-3">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Services complémentaires */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-50 pb-6"
      >
        <div className="max-w-6xl mx-auto py-5">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mt-10 mb-6 mx-6 sm:mx-0"
          >
            Services Complémentaires
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-6 sm:mx-0"
          >
            {[
              {
                icon: "/images/pharmacie icon.png",
                title: "Pharmacie Hospitalière",
                description: "Médicaments et produits de santé disponibles sur place avec conseils pharmaceutiques."
              },
              {
                icon: "/images/vaccination icon.png",
                title: "Vaccination & Prévention",
                description: "Services de vaccination et programmes de prévention pour tous les âges."
              },
              {
                icon: "/images/medecin travail icon.png",
                title: "Médecine du Travail",
                description: "Examens médicaux professionnels et conseils pour la santé au travail."
              },
              {
                icon: "/images/nutrition icon.png",
                title: "Bien-être & Nutrition",
                description: "Conseils nutritionnels et programmes de bien-être personnalisés."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={itemAnimation}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-100 p-2 rounded-full h-16 w-16 items-center flex justify-center"
                >
                  <img src={service.icon} alt={`${service.title} icon`} className="h-10" />
                </motion.div>
                <h3 className="text-xl font-bold mt-3">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto py-10"
      >
        {/* Informations pratiques */}
        <motion.h2 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mt-10 mb-6 mx-6 sm:mx-0"
        >
          Informations Pratiques
        </motion.h2>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-6 sm:mx-0"
        >
          <motion.div
            variants={itemAnimation}
            whileHover={{ scale: 1.02 }}
            className="bg-blue-100 p-6 rounded-lg"
          >
            <h3 className="text-black text-2xl font-bold">Horaires de consultation</h3>
            <p className="text-gray-600 mt-6">Consultations générales : Lundi au Vendredi, 8h-18h</p>
            <p className="text-gray-600 mt-2">Consultations spécialisées : Sur rendez-vous</p>
            <p className="text-gray-600 mt-2">Urgences : 24/7</p>
            <p className="text-gray-600 mt-2">Laboratoire d'analyses : Lundi au Samedi, 7h-19h</p>
          </motion.div>
          <motion.div
            variants={itemAnimation}
            whileHover={{ scale: 1.02 }}
            className="bg-blue-100 p-6 rounded-lg"
          >
            <h3 className="text-black text-2xl font-bold">Modalités de prise de rendez-vous</h3>
            <p className="text-gray-600 mt-6">En ligne : Via notre plateforme de réservation</p>
            <p className="text-gray-600 mt-2">Par téléphone : 698 819 573</p>
            <p className="text-gray-600 mt-2">Sur place : À l'accueil de l'hôpital</p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-white rounded-lg border border-blue-600 text-blue-600 px-4 py-1 hover:bg-blue-700 hover:text-white flex items-center"
            >
              Prendre rendez-vous <FaRegCalendar className="ml-3" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Services;