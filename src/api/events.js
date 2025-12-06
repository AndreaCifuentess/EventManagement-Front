import api from './axios';

export const getEvents = async () => {
  try {
    const response = await api.get("/events");
    return response.data; 
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {

    const response = await api.post("/events", eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data; 
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};
