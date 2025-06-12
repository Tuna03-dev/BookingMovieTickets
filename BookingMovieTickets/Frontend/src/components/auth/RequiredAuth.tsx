import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: ReactNode;
}

const isAuthenticated = (): boolean => {

  return !!localStorage.getItem('token');
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
