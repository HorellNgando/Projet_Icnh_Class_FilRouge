import React, { useState } from 'react';
import Navbar from '../components/vitrine/Navbar';
import Footer from '../components/vitrine/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openSection, setOpenSection] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

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

  const faqData = [
    {
      title: "Prise de rendez-vous",
      questions: [
        {
          question: "Comment prendre rendez-vous ?",
          answer: "Vous pouvez prendre rendez-vous de trois façons : en ligne via notre plateforme de réservation, par téléphone au 698 819 573, ou directement à l'accueil de l'hôpital."
        },
        {
          question: "Quels documents dois-je apporter ?",
          answer: "Veuillez apporter votre carte d'identité, votre carte vitale ou assurance maladie, et tout document médical pertinent (ordonnances, résultats d'analyses, etc.)."
        },
        {
          question: "Puis-je annuler ou modifier mon rendez-vous ?",
          answer: "Oui, vous pouvez annuler ou modifier votre rendez-vous jusqu'à 24h avant la date prévue, sans frais. Contactez-nous par téléphone ou via la plateforme en ligne."
        }
      ]
    },
    {
      title: "Horaires et Services",
      questions: [
        {
          question: "Quels sont vos horaires d'ouverture ?",
          answer: "Notre hôpital est ouvert 24h/24 pour les urgences. Les consultations générales sont disponibles du lundi au vendredi de 8h à 18h, et le samedi de 8h à 12h."
        },
        {
          question: "Proposez-vous des services d'urgence ?",
          answer: "Oui, notre service d'urgence est disponible 24h/24 et 7j/7, avec une équipe médicale qualifiée prête à intervenir."
        },
        {
          question: "Quels services spécialisés proposez-vous ?",
          answer: "Nous proposons une large gamme de services spécialisés incluant la cardiologie, la pédiatrie, la gynécologie, la radiologie, et bien d'autres. Consultez notre section Services pour plus de détails."
        }
      ]
    },
    {
      title: "Assurances et Paiements",
      questions: [
        {
          question: "Quelles assurances acceptez-vous ?",
          answer: "Nous acceptons la plupart des assurances maladie et mutuelles. Veuillez vérifier auprès de votre assureur la couverture de vos soins."
        },
        {
          question: "Quels sont les modes de paiement acceptés ?",
          answer: "Nous acceptons les paiements par carte bancaire, espèces, et chèques. Le paiement est généralement effectué après la consultation."
        },
        {
          question: "Proposez-vous des facilités de paiement ?",
          answer: "Oui, nous proposons des facilités de paiement pour les soins importants. N'hésitez pas à nous contacter pour plus d'informations."
        }
      ]
    },
    {
      title: "Dossiers Médicaux",
      questions: [
        {
          question: "Comment accéder à mon dossier médical ?",
          answer: "Vous pouvez accéder à votre dossier médical en ligne via votre espace patient, ou en faire la demande à l'accueil de l'hôpital."
        },
        {
          question: "Mes informations médicales sont-elles confidentielles ?",
          answer: "Oui, la confidentialité de vos informations médicales est garantie. Nous respectons strictement les règles de protection des données personnelles."
        },
        {
          question: "Puis-je partager mon dossier avec un autre médecin ?",
          answer: "Oui, vous pouvez autoriser le partage de votre dossier médical avec d'autres professionnels de santé de votre choix."
        }
      ]
    }
  ];

  return (
    <div className="overflow-hidden">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto py-10 px-4"
      >
        <motion.h1 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-3xl font-bold text-center mt-32 mb-8"
        >
          Questions Fréquemment Posées
        </motion.h1>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {faqData.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              variants={itemAnimation}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenSection(openSection === sectionIndex ? null : sectionIndex)}
                className="w-full px-6 py-4 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <h2 className="text-xl font-semibold text-blue-900">{section.title}</h2>
              </motion.button>

              <AnimatePresence>
                {openSection === sectionIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {section.questions.map((item, questionIndex) => (
                        <motion.div
                          key={questionIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: questionIndex * 0.1 }}
                          className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                        >
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setOpenQuestion(openQuestion === `${sectionIndex}-${questionIndex}` ? null : `${sectionIndex}-${questionIndex}`)}
                            className="w-full text-left"
                          >
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {item.question}
                            </h3>
                            <AnimatePresence>
                              {openQuestion === `${sectionIndex}-${questionIndex}` && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="text-gray-600"
                                >
                                  {item.answer}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="text-gray-600 mb-6">
            N'hésitez pas à nous contacter directement pour toute question supplémentaire.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Contactez-nous
          </motion.button>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default FAQ;