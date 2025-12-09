import api from './axios';

export const getReservations = async () => {
    try {
        const response = await api.get('/reserve');
        console.log("API Response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        throw error;
    }
}

export const createReservations = async () => {
    try {
        const response = await api.get('/reserve');
        console.log("API Response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        throw error;
    }


};