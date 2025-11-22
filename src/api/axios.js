import axios from 'axios';


const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach JWT token from localStorage if present
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function setAuthToken(newToken){
  if(newToken){
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

// Global response interceptor: if token expired or unauthorized, clear auth and redirect to signin
api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    if (status === 401) {
      try { localStorage.removeItem('token'); } catch (e) {}
      try { localStorage.removeItem('user'); } catch (e) {}
      delete api.defaults.headers.common['Authorization'];
      // redirect to sign-in so user can login again
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;