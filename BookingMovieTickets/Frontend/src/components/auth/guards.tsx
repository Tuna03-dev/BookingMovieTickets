import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';


export const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


export const AdminRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.roles?.includes('Admin') && !user?.roles?.includes('Admin')) {

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}; 