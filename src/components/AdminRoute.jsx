import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  
 
  if (user?.type !== "ADMIN") {
    return <Navigate to="/" />;
  }
  
  return children;
}