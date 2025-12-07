// src/api/entertainments.js
import api from './axios';

export const getEntertainments = async () => {
  try {
    const response = await api.get("/entertainments");
    return response.data;
  } catch (error) {
    console.error("Error fetching entertainments:", error);
    throw error;
  }
};

export const getEntertainmentById = async (id) => {
  try {
    const response = await api.get(`/entertainments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching entertainment with id ${id}:`, error);
    throw error;
  }
};

export const createEntertainment = async (entertainmentData) => {
  try {
    const response = await api.post("/entertainment", entertainmentData);
    return response.data;
  } catch (error) {
    console.error("Error creating entertainment:", error);
    throw error;
  }
};

export const updateEntertainment = async (id, entertainmentData) => {
  try {
    const response = await api.put(`/entertainments/${id}`, entertainmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating entertainment with id ${id}:`, error);
    throw error;
  }
};

export const deleteEntertainment = async (id) => {
  try {
    const response = await api.delete(`/entertainments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting entertainment with id ${id}:`, error);
    throw error;
  }
};