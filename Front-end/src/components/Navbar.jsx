import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // Icônes de React Icons

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Vérifie si l'utilisateur est connecté
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour le menu hamburger
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-[var(--white)] text-[var(--black)] p-4 shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/"><img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-20 w-auto mr-4" /></a>
          {/* <h1 className="text-[var(--text-sm)] font-bold">Clinique de Bali</h1> */}
        </div>

        {/* Menu pour laptop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-[var(--primary-blue)] transition-colors">Accueil</Link>
          <Link to="/services" className="hover:text-[var(--primary-blue)] transition-colors">Services</Link>
          <Link to="/about" className="hover:text-[var(--primary-blue)] transition-colors">À propos</Link>
          <Link to="/contact" className="hover:text-[var(--primary-blue)] transition-colors">Contact</Link>
          <Link to="/faq" className="hover:text-[var(--primary-blue)] transition-colors">FAQs</Link>
          {isLoggedIn ? (
            <>
              <Link to="/patient/dashboard" className="hover:text-[var(--primary-blue)] transition-colors">Mon Espace</Link>
              <button onClick={handleLogout} className="hover:text-[var(--primary-blue)] transition-colors">
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-[var(--primary-blue)] transition-colors">Connexion</Link>
          )}
          <button onClick={toggleTheme} className="focus:outline-none">
            {theme === 'light' ? (
              <FaSun className="w-6 h-6 text-[var(--yellow-star)]" />
            ) : (
              <FaMoon className="w-6 h-6 text-[var(--gray-medium)]" />
            )}
          </button>
        </div>

        {/* Menu hamburger pour mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6 text-[var(--black)]" />
            ) : (
              <FaBars className="w-6 h-6 text-[var(--black)]" />
            )}
          </button>
        </div>
      </div>

      {/* Menu déroulant pour mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--white)] text-[var(--black)] p-4 shadow-md">
          <ul className="space-y-4">
            <li>
              <Link to="/" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/services" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                À propos
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                FAQs
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/patient/dashboard" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                    Mon Espace
                  </Link>
                </li>
                <li>
                  <button onClick={() => { handleLogout(); toggleMenu(); }} className="block hover:text-[var(--primary-blue)] transition-colors">
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  <Link to="/login" className="block hover:text-[var(--primary-blue)] transition-colors" onClick={toggleMenu}>
                    Connexion
                  </Link>
                </button>
              </li>
            )}
            <li>
              <button onClick={toggleTheme} className="flex items-center focus:outline-none">
                {theme === 'light' ? (
                  <FaMoon className="w-6 h-6 text-[var(--gray-medium)] mr-2" />
                ) : (
                  <FaSun className="w-6 h-6 text-[var(--yellow-star)] mr-2" />
                )}
                {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;