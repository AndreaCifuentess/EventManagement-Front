import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token agregado automáticamente');
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 Token inválido/vencido');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.log('🚫 No tienes permisos para esta acción');
    }
    return Promise.reject(error);
  }
);

export default api;