import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; 
  }

  return children;
};

export default PrivateRoute;
