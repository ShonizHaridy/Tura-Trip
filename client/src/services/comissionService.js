import API from './api';

class CommissionService {
  // Get all commission settings
  async getCommissionSettings() {
    try {
      const response = await API.get('/commission');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch commission settings');
    }
  }

  // Update commission for a currency
  async updateCommission(currencyCode, commissionValue) {
    try {
      const response = await API.put('/commission', {
        currency_code: currencyCode,
        commission_value: commissionValue
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update commission');
    }
  }

  // Add new commission setting
  async addCommission(currencyCode, commissionValue) {
    try {
      const response = await API.post('/commission', {
        currency_code: currencyCode,
        commission_value: commissionValue
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add commission');
    }
  }

  // Delete commission setting
  async deleteCommission(currencyCode) {
    try {
      const response = await API.delete(`/commission/${currencyCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete commission');
    }
  }
}

export default new CommissionService();