import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Pour réagir à un changement de connexion ailleurs dans l'app
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // const handleEspaceClick = () => {
  //   if (!isLoggedIn) {
  //     navigate('/login');
  //   } else {
  //     navigate('/patient/dashboard');
  //   }
  // };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-white dark:bg-gray-900 shadow transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo - Section gauche */}
          <div className="flex-shrink-0">
            <a href="/">
              <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-16 w-auto" />
            </a>
          </div>

          {/* Menu principal - Section milieu */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <Link to="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">À propos</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-blue-600 transition-colors">FAQs</Link>
          </div>

          {/* Boutons d'authentification - Section droite */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button 
              onClick={handleEspaceClick}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Mon espace
            </button> */}
            <Link to="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Connexion
            </Link>
          </div>

          {/* Menu hamburger mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6 text-gray-800 dark:text-white" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-800 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 shadow-md">
          <ul className="space-y-4">
            <li><Link to="/" className="block hover:text-blue-600" onClick={toggleMenu}>Accueil</Link></li>
            <li><Link to="/services" className="block hover:text-blue-600" onClick={toggleMenu}>Services</Link></li>
            <li><Link to="/about" className="block hover:text-blue-600" onClick={toggleMenu}>À propos</Link></li>
            <li><Link to="/contact" className="block hover:text-blue-600" onClick={toggleMenu}>Contact</Link></li>
            <li><Link to="/faq" className="block hover:text-blue-600" onClick={toggleMenu}>FAQs</Link></li>
            {/* <li> */}
              {/* <button 
                onClick={() => {
                  handleEspaceClick();
                  toggleMenu();
                }}
                className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              > */}
                {/* Mon espace
              </button> */}
            {/* </li> */}
            <li>
              <Link 
                to="/login" 
                className="block w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center" 
                onClick={toggleMenu}
              >
                Connexion
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;