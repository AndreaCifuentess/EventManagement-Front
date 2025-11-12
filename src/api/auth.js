import api from './axios';

export const registerRequest  = {
  login: (email, password) => 
    api.post('/User/login', { email, password }),
    
  register: (userData) => 
    api.post('/User/register', userData),
    
};