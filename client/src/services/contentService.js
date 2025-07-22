// src/services/contentService.js
import api from './api';

class ContentService {
  // ================== FAQ METHODS ==================
  
  // Get all FAQs
  async getAllFAQs(params = {}) {
    try {
      const response = await api.get('/admin/content/faqs', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get FAQ by ID
  async getFAQById(id) {
    try {
      const response = await api.get(`/admin/content/faqs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new FAQ
  async createFAQ(faqData) {
    try {
      const response = await api.post('/admin/content/faqs', faqData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update FAQ
  async updateFAQ(id, faqData) {
    try {
      const response = await api.put(`/admin/content/faqs/${id}`, faqData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete FAQ
  async deleteFAQ(id) {
    try {
      const response = await api.delete(`/admin/content/faqs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ================== REVIEW METHODS ==================

  // Get all reviews
  async getAllReviews(params = {}) {
    try {
      const response = await api.get('/admin/content/reviews', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get review by ID
  async getReviewById(id) {
    try {
      const response = await api.get(`/admin/content/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new review
  async createReview(reviewData) {
    try {
      const response = await api.post('/admin/content/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update review
  async updateReview(id, reviewData) {
    try {
      const response = await api.put(`/admin/content/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete review
  async deleteReview(id) {
    try {
      const response = await api.delete(`/admin/content/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update review status
  async updateReviewStatus(id, isActive) {
    try {
      const response = await api.patch(`/admin/content/reviews/${id}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ContentService();