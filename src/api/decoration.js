import api from './axios';

export const getDecorations = async () => {
  try {
    const response = await api.get('/decoration');
    return response.data;
  } catch (error) {
       console.error("Error fetching decoration:", error);
    throw error;
  }
};

export const getDecorationById = async (id) => {
  try {
    const response = await api.get(`/decoration/${id}`);
    return response.data;
  } catch (error) {
      console.error("Error fetching decoration:", error);
    throw error;
  }
};

export const createDecoration = async (decorationData) => {
  try {
    const response = await api.post('/decoration', decorationData);
    return response.data;
  } catch (error) {
       console.error("Error fetching decoration:", error);
    throw error;
  }
};

export const updateDecoration = async (id, decorationData) => {
  try {
    const response = await api.put(`/decoration/${id}`, decorationData);
    return response.data;
  } catch (error) {
       console.error("Error fetching decoration:", error);
    throw error;
  }
};

export const deleteDecoration = async (id) => {
  try {
    const response = await api.delete(`/decoration/${id}`);
    return response.data;
  } catch (error) {
       console.error("Error fetching decoration:", error);
    throw error;
  }
};