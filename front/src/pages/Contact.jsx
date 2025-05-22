import React from 'react';
import Navbar from '../components/vitrine/Navbar';
import Footer from '../components/vitrine/Footer';
import { FaPhoneAlt, FaRegCalendar  } from 'react-icons/fa'; // Icônes pour les boutons
import { IoMdMail } from "react-icons/io";
import { GiPositionMarker } from "react-icons/gi";
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mt-32 mx-6 sm:mx-0">Contactez-nous</h1>
        <p className="text-center text-gray-600 mt-5 mx-6 sm:mx-0">
          Nous sommes à votre disposition pour répondre à toutes vos questions et vous aider dans vos démarches.
        </p>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
          <div className="mx-6 sm:mx-0 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Votre nom" className="border p-3 rounded w-full" />
                <input type="text" placeholder="Votre prénom" className="border p-3 rounded w-full" />
              </div>
              <input type="email" placeholder="votreemail@example.com" className="border p-3 rounded w-full" />
              <input type="text" placeholder="Votre numéro" className="border p-3 rounded w-full" />
              <input type="text" placeholder="Objet de votre message" className="border p-3 rounded w-full" />
              <textarea placeholder="Votre message" className="border p-3 rounded w-full h-32"></textarea>
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                Envoyer message
              </button>
            </form>
          </div>
        </div>

        {/* Localisation */}
        <div className="mt-10 mx-6 sm:mx-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.693692075123!2d9.704057314769238!3d4.051056297164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDMnMDQuMiJOIDnCsDQyJzE0LjYiRQ!5e0!3m2!1sfr!2sfr!4v1634567891234"
            className="w-full h-64 rounded-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;