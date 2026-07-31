import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Wraps protected routes. Redirects to /login if not authenticated.
 * Shows a full-screen spinner while the auth state is being initialized.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--color-bg)'
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
