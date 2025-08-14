// src/utils/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  console.log('🔍 ProtectedRoute: isAuthenticated =', isAuthenticated); // ⭐ Add this
  console.log('🔍 ProtectedRoute: loading =', loading); // ⭐ Add this
  console.log('🔍 ProtectedRoute: current location =', location.pathname); // ⭐ Add this
  
  if (loading) {
    console.log('⏳ ProtectedRoute: Showing loading spinner'); // ⭐ Add this
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login'); // ⭐ Add this
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  console.log('✅ ProtectedRoute: Authenticated, rendering children'); // ⭐ Add this
  return children;
};

export default ProtectedRoute;