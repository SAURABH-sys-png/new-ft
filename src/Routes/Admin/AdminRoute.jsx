import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
