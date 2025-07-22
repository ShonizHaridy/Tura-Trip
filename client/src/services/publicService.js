// src/services/publicService.js
import api from './api';

class PublicService {
  // Homepage data with featured tours, cities, promotional reviews
  async getHomepageData(language = 'en') {
    try {
      const response = await api.get(`/public/homepage?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      throw error;
    }
  }

  // Get all cities for header navigation
  async getCitiesForHeader(language = 'en') {
    try {
      const response = await api.get(`/public/cities/header?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities for header:', error);
      throw error;
    }
  }

  // Get city page data with tours
  async getCityData(cityName, language = 'en') {
    try {
      const response = await api.get(`/public/city/${cityName}?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching city data:', error);
      throw error;
    }
  }

  // Get tour details
  async getTourDetails(cityName, tourId, language = 'en') {
    try {
      const response = await api.get(`/public/city/${cityName}/tour/${tourId}?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour details:', error);
      throw error;
    }
  }

  // Search tours with filters
  async searchTours(params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/public/search?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error searching tours:', error);
      throw error;
    }
  }

  // Get FAQs
  async getFAQs(language = 'en') {
    try {
      const response = await api.get(`/public/faqs?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  // Get promotional reviews for homepage
  async getPromotionalReviews(language = 'en', limit = 6) {
    try {
      const response = await api.get(`/public/promotional-reviews?language=${language}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotional reviews:', error);
      throw error;
    }
  }

  // Currency conversion
  async convertCurrency(amount, from, to) {
    try {
      const response = await api.get(`/public/currency/convert?amount=${amount}&from=${from}&to=${to}`);
      return response.data;
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  }
}

export default new PublicService();