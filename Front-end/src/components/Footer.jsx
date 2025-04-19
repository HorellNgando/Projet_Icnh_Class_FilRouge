import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="mx-6 sm:mx-0">
          <div className="flex space-x-4 items-center">
            <a href="/"><img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-20 w-auto mr-4" /></a>
            <h3 className="text-xl font-semibold">Clinique de Bali</h3>
          </div>
          <p className="mt-5">
            Votre santé est notre priorité. Nous offrons des soins médicaux de qualité avec une approche humaine et professionnelle.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="mx-6 sm:mx-0">
          <h3 className="text-xl font-semibold">Accès rapide</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="hover:text-blue-400 transition-colors">Accueil</a></li>
            <li><a href="/services" className="hover:text-blue-400 transition-colors">Services</a></li>
            <li><a href="/about" className="hover:text-blue-400 transition-colors">À propos</a></li>
            <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            <li><a href="/faq" className="hover:text-blue-400 transition-colors">FAQs</a></li>
            <li><a href="/login" className="hover:text-blue-400 transition-colors">Mon Espace</a></li>
          </ul>
        </div>
        <div className="mx-6 sm:mx-0">
          <h3 className="text-xl font-semibold">Mentions Légales</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Conditions d’utilisation</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Mentions Légales</a></li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-6 text-gray-500">
        © 2025 Clinique de Bali. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;