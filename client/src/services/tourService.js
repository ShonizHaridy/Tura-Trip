// src/services/tourService.js
import api from './api';

class TourService {
  // Get all tours for admin
  async getAllTours(params = {}) {
    try {
      const response = await api.get('/admin/tours', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get tour by ID
  async getTourById(id) {
    try {
      const response = await api.get(`/admin/tours/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new tour
  async createTour(tourData) {
    try {
      const formData = new FormData();
      
      // Add basic tour data
      Object.keys(tourData.basicInfo).forEach(key => {
        formData.append(key, tourData.basicInfo[key]);
      });

      // Add cover image
      if (tourData.coverImage) {
        formData.append('coverImage', tourData.coverImage);
      }

      // Add tour images
      if (tourData.tourImages && tourData.tourImages.length > 0) {
        tourData.tourImages.forEach(image => {
          formData.append('tourImages', image);
        });
      }

      // Add language content
      formData.append('languages', JSON.stringify(tourData.languages));

      const response = await api.post('/admin/tours', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update tour
  async updateTour(id, tourData) {
    try {
      const formData = new FormData();
      
      // Add basic tour data
      Object.keys(tourData.basicInfo).forEach(key => {
        formData.append(key, tourData.basicInfo[key]);
      });

      // Add cover image if changed
      if (tourData.coverImage && typeof tourData.coverImage !== 'string') {
        formData.append('coverImage', tourData.coverImage);
      }

      // Add tour images if changed
      if (tourData.newTourImages && tourData.newTourImages.length > 0) {
        tourData.newTourImages.forEach(image => {
          formData.append('tourImages', image);
        });
      }

      // Add language content
      formData.append('languages', JSON.stringify(tourData.languages));

      const response = await api.put(`/admin/tours/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete tour
  async deleteTour(id) {
    try {
      const response = await api.delete(`/admin/tours/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update tour status
  async updateTourStatus(id, status) {
    try {
      const response = await api.patch(`/admin/tours/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TourService();