// src/services/adminService.js
import api from './api';

class AdminService {
  // Authentication
  async login(credentials) {
    try {
      const response = await api.post('/admin/login', credentials);
      if (response.data.success) {
        localStorage.setItem('admin_token', response.data.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.data.admin));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  async verifyToken() {
    try {
      const response = await api.get('/admin/verify-token');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/admin/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Tours management
  async getTours(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/tours?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }

  async getTourById(id) {
    try {
      const response = await api.get(`/admin/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  }

  async createTour(formData) {
    try {
      const response = await api.post('/admin/tours', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }

  async updateTour(id, formData) {
    try {
      const response = await api.put(`/admin/tours/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  }

  async deleteTour(id) {
    try {
      const response = await api.delete(`/admin/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  }

  async updateTourStatus(id, status) {
    try {
      const response = await api.patch(`/admin/tours/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating tour status:', error);
      throw error;
    }
  }

  // Cities management
  async getCities() {
    try {
      const response = await api.get('/admin/cities');
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  async createCity(cityData) {
    try {
      const response = await api.post('/admin/cities', cityData);
      return response.data;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  }

  async updateCity(id, cityData) {
    try {
      const response = await api.put(`/admin/cities/${id}`, cityData);
      return response.data;
    } catch (error) {
      console.error('Error updating city:', error);
      throw error;
    }
  }

  async toggleCityStatus(id) {
    try {
      const response = await api.patch(`/admin/cities/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling city status:', error);
      throw error;
    }
  }

  // Categories management
  async getCategories() {
    try {
      const response = await api.get('/admin/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Content Management - FAQs
  async getFAQs(language = 'en') {
    try {
      const response = await api.get(`/admin/content/faqs?language_code=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  async createFAQ(faqData) {
    try {
      const response = await api.post('/admin/content/faqs', faqData);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  async updateFAQ(id, faqData) {
    try {
      const response = await api.put(`/admin/content/faqs/${id}`, faqData);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  async deleteFAQ(id) {
    try {
      const response = await api.delete(`/admin/content/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }

  // Content Management - Reviews
  async getReviews(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/content/reviews?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async createReview(reviewData) {
    try {
      const response = await api.post('/admin/content/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async toggleReviewStatus(id) {
    try {
      const response = await api.patch(`/admin/content/reviews/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling review status:', error);
      throw error;
    }
  }

  // Promotional Reviews
  async getPromotionalReviews() {
    try {
      const response = await api.get('/admin/content/promotional-reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching promotional reviews:', error);
      throw error;
    }
  }

  async createPromotionalReview(reviewData) {
    try {
      const response = await api.post('/admin/content/promotional-reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating promotional review:', error);
      throw error;
    }
  }

  async updatePromotionalReview(id, reviewData) {
    try {
      const response = await api.put(`/admin/content/promotional-reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating promotional review:', error);
      throw error;
    }
  }

  // Currency & Commission Management
  async getCurrencies() {
    try {
      const response = await api.get('/admin/currency/currencies');
      return response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  async getCommissionRates() {
    try {
      const response = await api.get('/admin/currency/commission');
      return response.data;
    } catch (error) {
      console.error('Error fetching commission rates:', error);
      throw error;
    }
  }

  async updateCommissionRate(commissionData) {
    try {
      const response = await api.post('/admin/currency/commission', commissionData);
      return response.data;
    } catch (error) {
      console.error('Error updating commission rate:', error);
      throw error;
    }
  }
}

export default new AdminService();