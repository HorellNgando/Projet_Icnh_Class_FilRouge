/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', // Inclut le fichier HTML principal
    './src/**/*.{js,jsx,ts,tsx}', // Inclut tous les fichiers JS/JSX/TS/TSX dans src et ses sous-dossiers
  ],
  darkMode: 'class', // Active le mode sombre avec la classe 'dark'
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a202c',
        'dark-text': '#e2e8f0',
        'dark-card': '#2d3748',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        slideUp: 'slideUp 1s ease-in-out',
        bounceIn: 'bounceIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '60%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};