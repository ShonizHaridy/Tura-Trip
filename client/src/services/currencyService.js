// src/services/currencyService.js
import api from './api';

class CurrencyService {
  // Get currency conversion
  async convertCurrency(fromCurrency, toCurrency, amount) {
    try {
      const response = await api.get('/public/currency/convert', {
        params: {
          from: fromCurrency,
          to: toCurrency,
          amount: amount
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all currencies
  async getAllCurrencies() {
    try {
      const response = await api.get('/admin/currency/currencies');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get organizer commissions
  async getCommissions() {
    try {
      const response = await api.get('/admin/currency/commission');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update organizer commission
  async updateCommission(currencyCode, amount) {
    try {
      const response = await api.put(`/admin/currency/commission/${currencyCode}`, {
        commission_amount: amount
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create organizer commission
  async createCommission(commissionData) {
    try {
      const response = await api.post('/admin/currency/commission', commissionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CurrencyService();