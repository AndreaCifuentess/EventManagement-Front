import api from './axios';

export const getCatering = async () => {
  try {
    const response = await api.get("/catering");
    return response.data;
  } catch (error) {
    console.error("Error fetching catering:", error);
    throw error;
  }
};

export const getCateringById = async (id) => {
  try {
    const response = await api.get(`/catering/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching catering with id ${id}:`, error);
    throw error;
  }
};

export const createCatering = async (cateringData) => {
  try {
    const response = await api.post("/catering", cateringData);
    return response.data;
  } catch (error) {
    console.error("Error creating catering:", error);
    throw error;
  }
};

export const updateCatering = async (id, cateringData) => {
  try {
    const response = await api.put(`/catering/${id}`, cateringData);
    return response.data;
  } catch (error) {
    console.error(`Error updating catering with id ${id}:`, error);
    throw error;
  }
};

export const deleteCatering = async (id) => {
  try {
    const response = await api.delete(`/catering/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting catering with id ${id}:`, error);
    throw error;
  }
};