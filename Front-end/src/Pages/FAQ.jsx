import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQ = () => {
  const faqs = {
    'Prise de rendez-vous': [
      {
        question: 'Comment puis-je prendre un rendez-vous ?',
        answer:
          'Vous pouvez prendre un rendez-vous en ligne via notre plateforme, par téléphone au 698 819 573, ou directement à l’accueil de l’hôpital.',
      },
      {
        question: 'Puis-je modifier ou annuler mon rendez-vous ?',
        answer:
          'Oui, connectez-vous à votre espace patient pour modifier ou annuler votre rendez-vous. Vous pouvez également nous appeler.',
      },
    ],
    'Horaires et Services': [
      {
        question: 'Quels sont les horaires d’ouverture ?',
        answer:
          'Consultations : Lundi au Vendredi de 8h à 18h. Urgences : 24/7. Laboratoire : Lundi au Samedi de 7h à 19h.',
      },
      {
        question: 'Quels services proposez-vous ?',
        answer:
          'Nous proposons des consultations générales et spécialisées, des urgences 24/7, des soins intensifs, une maternité, et plus encore.',
      },
    ],
    'Assurances et Paiements': [
      {
        question: 'Acceptez-vous les assurances ?',
        answer:
          'Oui, nous collaborons avec plusieurs compagnies d’assurance. Veuillez contacter notre service administratif pour plus de détails.',
      },
      {
        question: 'Comment puis-je payer ma facture ?',
        answer:
          'Vous pouvez payer vos factures en ligne via votre espace patient, ou directement à l’hôpital par carte ou en espèces.',
      },
    ],
    'Dossiers Médicaux': [
      {
        question: 'Comment puis-je accéder à mon dossier médical ?',
        answer:
          'Connectez-vous à votre espace patient pour consulter ou télécharger votre dossier médical.',
      },
      {
        question: 'Mes données sont-elles sécurisées ?',
        answer:
          'Oui, nous respectons strictement les normes de confidentialité et de sécurité des données de santé.',
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mt-32 animate-fadeIn">Foire aux Questions (FAQ)</h1>
        <p className="text-center text-gray-600 mb-8">
          Trouvez les réponses aux questions fréquemment posées sur nos services et notre fonctionnement.
        </p>

        {/* Questions par thématique */}
        {Object.keys(faqs).map((theme, index) => (
          <div key={index} className="mb-10 animate-slideUp">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">{theme}</h2>
            <div className="space-y-4">
              {faqs[theme].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

       {/* Contact */}
      <div className="max-w-6xl mx-auto ">
        <div className="text-center mt-10 bg-blue-600 rounded-lg">
          <div className="max-w-6xl mx-auto py-5 justify-items-center ">
            <h2 className="text-3xl font-bold mb-4 text-white">Avez vous des questions ?</h2>
            <div className="flex space-x-5 mt-5">
              <button className="mt-4 bg-white rounded-lg border hover:border-white text-blue-600 px-6 py-1 hover:bg-blue-700 hover:text-white flex items-center">
                <a href="/contact">Nous contacter </a>
              </button>
              {/* <button className="mt-4 hover:bg-white rounded-lg border hover:border-blue-600 hover:text-blue-600 px-4 py-1 bg-blue-700 text-white flex items-center">
                <a href="/contact">Nous contacter</a>
              </button> */}
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;