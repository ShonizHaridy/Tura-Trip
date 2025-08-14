// controllers/notificationController.js
const { pool } = require('../config/database');

class NotificationController {
  // Create notification (called when non-admin adds review/comment)
  async createNotification(type, title, message, relatedId = null, relatedType = null) {
    try {
      await pool.execute(`
        INSERT INTO notifications (type, title, message, related_id, related_type)
        VALUES (?, ?, ?, ?, ?)
      `, [type, title, message, relatedId, relatedType]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  // Get notifications for admin
  async getNotifications(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        unread_only = false 
      } = req.query;

      const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      let whereClause = '';
      let queryParams = [];

      if (unread_only === 'true') {
        whereClause = 'WHERE is_read = false';
      }

      const query = `
        SELECT * FROM notifications 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      const [notifications] = await pool.execute(query, queryParams);

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM notifications ${whereClause}`;
      const [countResult] = await pool.execute(countQuery, queryParams);
      const totalNotifications = countResult[0].total;

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            currentPage: safePage,
            totalPages: Math.ceil(totalNotifications / safeLimit),
            totalItems: totalNotifications,
            itemsPerPage: safeLimit
          }
        }
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get unread count
  async getUnreadCount(req, res) {
    try {
      const [result] = await pool.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE is_read = false'
      );

      res.json({
        success: true,
        data: { count: result[0].count }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mark notifications as read
  async markAsRead(req, res) {
    try {
      const { notificationIds } = req.body;

      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification IDs'
        });
      }

      const placeholders = notificationIds.map(() => '?').join(',');
      await pool.execute(
        `UPDATE notifications SET is_read = true WHERE id IN (${placeholders})`,
        notificationIds
      );

      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new NotificationController();