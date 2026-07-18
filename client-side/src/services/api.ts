import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch unauthorized responses (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API] Token expired or invalid. Logging out.');
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      // Redirect to login page if currently on a protected route
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/activate') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
