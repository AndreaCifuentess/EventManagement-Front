import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export { AuthContext }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔄 AuthProvider - Cargando estado inicial");
    console.log("🔑 Token en localStorage:", token ? "SÍ" : "NO");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("🎫 Token decodificado:", decodedToken);
        
        // Verificar si el token no ha expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("⏰ Token expirado");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          // Si el token es válido, establecer el usuario
          const userData = localStorage.getItem("user");
          console.log("📦 User data en localStorage:", userData);
          if (userData) {
            const parsedUser = JSON.parse(userData);
            console.log("👤 Usuario parseado:", parsedUser);
            console.log("🎯 Tipo de usuario (desde localStorage):", parsedUser?.type);
            // Verificamos que el usuario tenga un tipo, si no, podría ser un error
            if (parsedUser && parsedUser.type) {
              setUser(parsedUser);
            } else {
              console.warn("El usuario no tiene tipo definido, no se establecerá el estado de autenticación.");
            }
          } else {
            console.log("No hay user en localStorage");
          }
        }
      } catch (error) {
        console.error("❌ Error decodificando el token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    console.log("🔥 AuthContext.login() llamado");
    console.log("🔑 Token recibido:", token ? "SÍ (longitud: " + token.length + ")" : "NO");
    console.log("👤 UserData recibido:", userData);
    console.log("🎯 Tipo de usuario recibido:", userData?.type);
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // Verificar que se guardó correctamente
    const savedUser = JSON.parse(localStorage.getItem('user'));
    console.log("💾 Usuario guardado en localStorage:", savedUser);
  };

  const logout = () => {
    console.log("👋 AuthContext.logout() llamado");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  console.log("🔄 AuthProvider render - user:", user);
  console.log("🔐 AuthProvider render - isAuthenticated:", !!user);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};