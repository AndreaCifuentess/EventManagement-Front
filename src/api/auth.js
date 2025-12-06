import api from './axios';

export const loginRequest = (email, password) => 
  api.post('/User/login', { email, password });

export const registerRequest = (userData) => 
  api.post('/User/register', userData);
