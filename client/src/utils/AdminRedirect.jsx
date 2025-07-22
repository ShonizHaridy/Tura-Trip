// src/utils/AdminRedirect.jsx  
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminRedirect = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRedirect;