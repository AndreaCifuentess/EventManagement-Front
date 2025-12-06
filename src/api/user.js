import api from './axios';

//Corregir por endpoints reales

// Obtener perfil del usuario
export const getUserProfile = async () => {
    try {
        const response = await api.get("/api/users/profile");
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

// Obtener reservas del usuario
export const getUserReservations = async () => {
    try {
        const response = await api.get("/api/users/reservations");
        return response;
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        throw error;
    }
};

// Obtener pagos del usuario
export const getUserPayments = async () => {
    try {
        const response = await api.get("/api/users/payments");
        return response;
    } catch (error) {
        console.error("Error fetching user payments:", error);
        throw error;
    }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put("/api/users/profile", userData);
        return response;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};