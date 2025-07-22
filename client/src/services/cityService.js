// src/services/cityService.js
import api from './api';

class CityService {
  // Get all cities for admin
  async getAllCities(params = {}) {
    try {
      const response = await api.get('/admin/cities', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get city by ID
  async getCityById(id) {
    try {
      const response = await api.get(`/admin/cities/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new city
  async createCity(cityData) {
    try {
      const formData = new FormData();
      
      formData.append('name', cityData.name);
      formData.append('description', cityData.description || '');
      
      if (cityData.image && typeof cityData.image !== 'string') {
        formData.append('image', cityData.image);
      }

      const response = await api.post('/admin/cities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update city
  async updateCity(id, cityData) {
    try {
      const formData = new FormData();
      
      formData.append('name', cityData.name);
      formData.append('description', cityData.description || '');
      
      if (cityData.image && typeof cityData.image !== 'string') {
        formData.append('image', cityData.image);
      }

      const response = await api.put(`/admin/cities/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete city
  async deleteCity(id) {
    try {
      const response = await api.delete(`/admin/cities/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update city status
  async updateCityStatus(id, isActive) {
    try {
      const response = await api.patch(`/admin/cities/${id}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CityService();