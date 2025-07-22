// src/services/dashboardService.js
import api from './api';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DashboardService();