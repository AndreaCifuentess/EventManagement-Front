import api from './axios';

export const getAdditionals  = async () => {
  try {
    const response = await api.get('/additional');
    return response.data;
  } catch (error) {
     console.error("Error fetching additionals:", error);
    throw error;
  }
  }; 

export const getAdditionalById = async (id) => {
  try {
    const response = await api.get(`/additional/${id}`);
    return response.data;
  } catch (error) {
     console.error("Error fetching additionals:", error);
    throw error;
  }
};

export const createAdditional = async (additionalData) => {
  try {
    const response = await api.post('/additional', additionalData);
    return response.data;
  } catch (error) {
     console.error("Error creating additional:", error);
    throw error;
  }
};

export const updateAdditional = async (id, additionalData) => {
  try {
    const response = await api.put(`/additional/${id}`, additionalData);
    return response.data;
  } catch (error) {
     console.error("Error updating additional:", error);
    throw error;
  }
};

export const deleteAdditional = async (id) => {
  try {
    const response = await api.delete(`/additionals/${id}`);
    return response.data;
  } catch (error) {
      console.error("Error deleting additional:", error);
    throw error;
  }
};