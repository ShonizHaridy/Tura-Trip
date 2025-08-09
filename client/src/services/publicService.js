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

  // Get more featured tours for homepage
  async getMoreFeaturedTours(language = 'en', offset = 6, limit = 6) {
    try {
      const response = await api.get(`/public/homepage/more-tours?language=${language}&offset=${offset}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching more featured tours:', error);
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
   async getCityData(cityName, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/public/city/${cityName}?${queryString}`);
      console.log("City data response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching city page data:', error);
      throw error;
    }
  };

  // Get more tours for city page
  async getMoreCityTours(cityName, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/public/city/${cityName}?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching more city tours:', error);
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

  // Get more like this tours
  async getMoreLikeThisTours(tourId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/public/tours/${tourId}/more-like-this?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching more like this tours:', error);
      throw error;
    }
  }


  // Get browse tours data
  async getBrowseToursData(language = 'en', includeAllTours = false) {
    try {
      const params = new URLSearchParams({
        language,
        include_all_tours: includeAllTours.toString()
      });
      
      const response = await api.get(`/public/browse-tours?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching browse tours data:', error);
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

  // Get categories for search dropdown
  async getPublicCategories(language = 'en') {
    try {
      const response = await api.get(`/public/categories?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public categories:', error);
      throw error;
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query, language = 'en') {
    try {
      const response = await api.get(`/public/search/suggestions?q=${query}&language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
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

  async submitReview(tourId, reviewData) {
    try {
      // Create FormData for handling file uploads
      const formData = new FormData();
      
      // Add text fields
      formData.append('client_name', reviewData.client_name);
      formData.append('comment', reviewData.comment);
      formData.append('language', reviewData.language || 'en');
      
      // Add images if provided
      if (reviewData.client_image) {
        formData.append('client_image', reviewData.client_image);
      }
      
      if (reviewData.profile_image) {
        formData.append('profile_image', reviewData.profile_image);
      }
      
      const response = await api.post(`/public/tours/${tourId}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Get commission rates
  async getCommissionRates() {
    try {
      const response = await api.get('/public/commission-rates');
      return response.data;
    } catch (error) {
      console.error('Error fetching commission rates:', error);
      throw error;
    }
  }

  // Get about page data (lightweight)
  async getReviewsCount(language = 'en') {
    try {
      const response = await api.get(`/public/reviews-count?language=${language}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching about page data:', error);
      throw error;
    }
  }

  // Get client country for auto-detection
  async getClientCountry() {
    try {
      const response = await api.get('/public/client-country');
      return response.data;
    } catch (error) {
      console.error('Error detecting client country:', error);
      throw error;
    }
  }

  // Submit contact form
  async submitContactForm(formData) {
    try {
      const response = await api.post('/public/contact', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }

}

export default new PublicService();