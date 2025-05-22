import React from 'react';
import { Link } from 'react-router-dom';

const Confidentialite = () => (
  <div className="min-h-screen flex flex-col justify-between bg-gray-50">
    {/* Header bleu avec logo et titre */}
    <div className="bg-blue-700 py-10 flex flex-col items-center">
      <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-20 mb-4" />
      <h1 className="text-4xl font-bold text-white text-center">Politique de confidentialité</h1>
    </div>
    {/* Contenu */}
    <div className="flex-1 flex justify-center items-start py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">1. Collecte des informations</h2>
          <p className="text-gray-700">Nous collectons les informations que vous nous fournissez lors de la création de votre compte, de la prise de rendez-vous ou de l'utilisation de nos services.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">2. Utilisation des données</h2>
          <p className="text-gray-700">Vos données sont utilisées uniquement pour la gestion de votre dossier médical, la prise de rendez-vous et l'amélioration de nos services. Nous ne partageons jamais vos informations sans votre consentement, sauf obligation légale.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">3. Sécurité</h2>
          <p className="text-gray-700">Nous mettons en œuvre des mesures de sécurité pour protéger vos données contre tout accès non autorisé.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">4. Vos droits</h2>
          <p className="text-gray-700">Vous pouvez accéder, corriger ou supprimer vos données personnelles à tout moment en nous contactant.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">5. Contact</h2>
          <p className="text-gray-700">Pour toute question concernant la confidentialité, contactez-nous à <a href="mailto:contact@cliniquedebali.com" className="text-blue-600 underline">contact@cliniquedebali.com</a>.</p>
        </section>
      </div>
    </div>
    <footer className="bg-gray-900 text-white py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-12 mb-2" />
          <div className="font-bold mb-2">Nom de l'hopital</div>
          <div className="text-sm mb-2">Votre santé est notre priorité. Nous offrons des soins médicaux de qualité avec une approche humaine et professionnelle.</div>
          <div className="flex space-x-2 mt-2">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">Accès rapide</div>
          <ul className="text-sm space-y-1">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">A Propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/patient/dashboard">Mon Espace</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Mentions Légales</div>
          <ul className="text-sm space-y-1">
            <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
            <li><Link to="/conditions">Conditions d'utilisation</Link></li>
            <li><Link to="/mentions">Mentions Légales</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-6">© 2025 clinique de Bali. Tous droits réservés.</div>
    </footer>
  </div>
);

export default Confidentialite; 