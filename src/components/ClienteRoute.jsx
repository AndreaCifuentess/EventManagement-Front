
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ClientRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/sign-in" />;
  }

  // Si está autenticado pero es administrador, redirigir al dashboard de admin
  if (user?.type === 'ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }

  // Si es cliente, mostrar el componente hijo
  return children;
}