import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axios";

// Create context
const AuthContext = createContext();

// Hook to use context
export function useAuth() {
  return useContext(AuthContext);
}

// Context Provider (JWT-based, no Firebase)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    // Ensure axios has token if present
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem("user");
    } catch (e) {}
  };

  const value = { user, setUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
