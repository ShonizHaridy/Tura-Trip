// src/services/categoryService.js
import api from './api';

class CategoryService {
  // Get all categories for admin
  async getAllCategories(params = {}) {
    try {
      const response = await api.get('/admin/categories', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await api.get(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      const response = await api.post('/admin/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update category
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/admin/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update category status
  async updateCategoryStatus(id, isActive) {
    try {
      const response = await api.patch(`/admin/categories/${id}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();