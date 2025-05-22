import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Intercepteur spécial pour FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

// Intercepteur pour l'authentification et CSRF
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config.url?.includes('/sanctum/csrf-cookie')) {
    if (!document.cookie.includes('XSRF-TOKEN')) {
      try {
        await axios.get(
          (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/sanctum/csrf-cookie',
          { 
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        );
        
        const xsrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
        
        if (xsrfToken) {
          config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
      } catch (error) {
        console.error('CSRF token fetch failed:', error);
        throw error;
      }
    } else {
      const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      
      if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      }
    }
  }

  return config;
});

// Intercepteur de réponse amélioré
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (!response) {
      console.error('Network error:', error);
      return Promise.reject(error);
    }

    // Gestion spécifique pour les erreurs de réinitialisation de mot de passe
    if (response.config.url?.includes('/forgot-password') || 
        response.config.url?.includes('/verify-code') || 
        response.config.url?.includes('/reset-password')) {
      return Promise.reject(error);
    }

    switch (response.status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Forbidden:', response.data);
        break;
      case 404:
        console.error('Not found:', response.config.url);
        break;
      case 419:
        console.warn('CSRF token mismatch, retrying...');
        return api(error.config);
      case 422:
        console.error('Validation errors:', response.data.errors);
        break;
      default:
        console.error('Server error:', response.status, response.data);
    }

    return Promise.reject(error);
  }
);

export default api;