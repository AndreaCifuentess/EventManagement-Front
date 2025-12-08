import api from './axios';


// Obtener usuarios por tipo (CLIENTE, ADMIN, etc.)
export const getUsersByType = async (type) => {
  try {
    const response = await api.get(`/User/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching users by type ${type}:`, error);
    throw error;
  }
};

// Obtener solo usuarios con type === 'CLIENTE'
export const getClients = async () => {
  try {
    return await getUsersByType('CLIENTE');
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Obtener pagos del usuario
export const getUserPayments = async () => {
    try {
        const response = await api.get("/payments");
        return response;
    } catch (error) {
        console.error("Error fetching user payments:", error);
        throw error;
    }
};



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




// Actualizar perfil del usuario (cambiar por uno real)
export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put("/api/users/profile", userData);
        return response;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};