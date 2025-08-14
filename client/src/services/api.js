// src/services/api.js
import axios from 'axios';

// Get API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      // ⭐ FIXED: Don't redirect if this is a login attempt
      const isLoginRequest = error.config?.url?.includes('/admin/login');
      
      if (!isLoginRequest) {
        // Only clear tokens and redirect for other 401s (expired sessions, etc.)
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        
        // Redirect to login if on admin route
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
      // For login requests, let the login form handle the 401 error
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;