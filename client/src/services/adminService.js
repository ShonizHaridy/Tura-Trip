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

  async forgotPassword(data) {
    try {
      const response = await api.post('/admin/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(data) {
    try {
      const response = await api.post('/admin/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
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
  // async getTours(params = {}) {
  //   try {
  //     const queryString = new URLSearchParams(params).toString();
  //     const response = await api.get(`/admin/tours?${queryString}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching tours:', error);
  //     throw error;
  //   }
  // }

async getTours(params = {}) {
  try {
    // Build query parameters properly including min_price and max_price
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      city_id: params.city_id || '',
      category_id: params.category_id || '',
      status: params.status || '',
      min_price: params.min_price || '',    // ✅ ADD THIS
      max_price: params.max_price || ''     // ✅ ADD THIS
    };
    
    // Remove empty values to clean up URL
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });
    
    const queryString = new URLSearchParams(queryParams).toString();
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
      
      // Return the error response for better error handling
      if (error.response) {
        return error.response.data;
      }
      
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

  async getCityById(id) {
  try {
    const response = await api.get(`/admin/cities/${id}?include_translations=true`);
    return response.data;
  } catch (error) {
    console.error('Error fetching city:', error);
    throw error;
  }
}


async createCity(formData) {
  try {
    const response = await api.post('/admin/cities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating city:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

// Update updateCity method
async updateCity(id, formData) {
  try {
    const response = await api.put(`/admin/cities/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating city:', error);
    if (error.response) {
      return error.response.data;
    }
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

  // Add this method to your adminService.js
  async deleteCity(id) {
    try {
      const response = await api.delete(`/admin/cities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }

  // Categories management
// Categories management - Updated methods
async createCategory(categoryData) {
  try {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

async updateCategory(id, categoryData) {
  try {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

async getCategoryById(id) {
  try {
    const response = await api.get(`/admin/categories/${id}?include_translations=true`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

async getCategories(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/categories${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Add this method to your adminService.js
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Content Management - FAQs
  // FAQ Management - Updated methods
  async getFAQs(language = null, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      
      // If no language specified, get all translations (admin mode)
      const url = language 
        ? `/admin/content/faqs?language_code=${language}&${queryParams}`
        : `/admin/content/faqs?${queryParams}`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  async getFAQById(id) {
    try {
      const response = await api.get(`/admin/content/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      throw error;
    }
  }

  async createFAQ(faqData) {
    try {
      const response = await api.post('/admin/content/faqs', faqData);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  async updateFAQ(id, faqData) {
    try {
      const response = await api.put(`/admin/content/faqs/${id}`, faqData);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      if (error.response) {
        return error.response.data;
      }
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
      const response = await api.post('/admin/content/reviews', reviewData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  async updateReview(id, reviewData) {
    try {
      const response = await api.put(`/admin/content/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      const response = await api.delete(`/admin/content/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
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

  // Promotional Reviews Management  
  async getPromotionalReviews(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/content/promotional-reviews?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotional reviews:', error);
      throw error;
    }
  }

  async createPromotionalReview(reviewData) {
    try {
      const response = await api.post('/admin/content/promotional-reviews', reviewData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating promotional review:', error);
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  async updatePromotionalReview(id, reviewData) {
    try {
      const response = await api.put(`/admin/content/promotional-reviews/${id}`, reviewData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating promotional review:', error);
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  async deletePromotionalReview(id) {
    try {
      const response = await api.delete(`/admin/content/promotional-reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting promotional review:', error);
      throw error;
    }
  }

  // Currency & Commission Management
  async getCurrencies() {
    try {
      const response = await api.get('/admin/currency/currencies?active_only=true');
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