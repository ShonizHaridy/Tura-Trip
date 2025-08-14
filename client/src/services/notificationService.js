// services/notificationService.js
import api from './api';

class NotificationService {
  async getNotifications(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/notifications?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationIds) {
    try {
      const response = await api.patch('/admin/notifications/mark-read', {
        notificationIds
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const response = await api.get('/admin/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

export default new NotificationService();