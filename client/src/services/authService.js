// src/services/authService.js
import api from './api';

class AuthService {
  // Login admin user
  async login(credentials) {
    try {
      const loginData = {
        admin_id: credentials.adminId, // Send as admin_id (matches UI)
        password: credentials.password
      };

      console.log('🔐 Attempting login with:', loginData);

      const response = await api.post('/admin/login', loginData);
      
      if (response.data.success) {
        const { token, admin } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        
        return {
          success: true,
          data: { token, admin }
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      console.error('❌ Login service error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  // Logout admin user
  async logout() {
    try {
      await api.post('/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }

  // Get current admin profile
  async getProfile() {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  }

  // Get current user data
  getCurrentUser() {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('adminToken');
  }
}

export default new AuthService();