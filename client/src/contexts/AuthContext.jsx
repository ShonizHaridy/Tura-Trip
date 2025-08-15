// src/contexts/AuthContext.jsx - UPDATED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';
import adminService from '../services/adminService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const storedAdmin = localStorage.getItem('admin_user');
        
        if (token && storedAdmin) {
          const response = await adminService.verifyToken();
          
          if (!ignore && response.success) {
            setIsAuthenticated(true);
            setAdmin(response.data);
          } else if (!ignore) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setIsAuthenticated(false);
            setAdmin(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (!ignore) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
          setAdmin(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
    
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await adminService.login(credentials);
      
      if (response.success) {
        setIsAuthenticated(true);
        setAdmin(response.data.admin);
        setLoading(false);
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Auth login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const updateAdmin = (updatedAdminData) => {
    console.log('🔄 AuthContext: Updating admin data:', updatedAdminData);
    setAdmin(updatedAdminData);
    // ✅ Ensure localStorage is updated
    localStorage.setItem('admin_user', JSON.stringify(updatedAdminData));
    console.log('💾 AuthContext: Updated localStorage');
  };

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout,
    updateAdmin, // ✅ ADD: Expose updateAdmin function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};