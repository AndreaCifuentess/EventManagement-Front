import api from './axios';

//Obtner catering
export const getCatering = async () => {
  try {
    const response = await api.get("/catering");
    return response.data;
  } catch (error) {
    console.error("Error fetching catering:", error);
    throw error;
  }
};

export const getEntertainments = async () => {
  try {
    const response = await api.get("/entertainment");
    return response.data;
  } catch (error) {
    console.error("Error fetching entertainments:", error);
    throw error;
  }
};

export const getDecorations = async () => {
  try {
    const response = await api.get('/decoration');
    return response.data;
  } catch (error) {
       console.error("Error fetching decoration:", error);
    throw error;
  }
};

export const getAdditionals  = async () => {
  try {
    const response = await api.get('/additional');
    return response.data;
  } catch (error) {
     console.error("Error fetching additionals:", error);
    throw error;
  }
  }; 

