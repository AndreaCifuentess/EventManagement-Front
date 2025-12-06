import api from './axios';

export const getEstablishments = async () => {
  try {
    const response = await api.get("/establishments");
    return response.data; 
  } catch (error) {
    console.error("Error fetching establishments:", error);
    throw error;
  }
};

export const getEstablishmentById = async (id) => {
  try {
    const response = await api.get(`/establishments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching establishment ${id}:`, error);
    throw error;
  }
};

export const createEstablishment = async (establishmentData) => {
  try {
    const response = await api.post("/establishments", establishmentData);
    return response.data;
  } catch (error) {
    console.error("Error creating establishment:", error);
    throw error;
  }
};

export const updateEstablishment = async (id, establishmentData) => {
  try {
    const response = await api.put(`/establishments/${id}`, establishmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating establishment ${id}:`, error);
    throw error;
  }
};

export const deleteEstablishment = async (id) => {
  try {
    const response = await api.delete(`/establishments/${id}`);
    return response.data; 
  } catch (error) {
    console.error(`Error deleting establishment ${id}:`, error);
    throw error;
  }
};