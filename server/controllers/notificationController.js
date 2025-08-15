// controllers/notificationController.js
const { pool } = require('../config/database');

class NotificationController {
  // Create notification (called when non-admin adds review/comment)
  async createNotification(type, title, message, relatedId = null, relatedType = null) {
    try {
      const [result] = await pool.execute(`
        INSERT INTO notifications (type, title, message, related_id, related_type)
        VALUES (?, ?, ?, ?, ?)
      `, [type, title, message, relatedId, relatedType]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  // Get notifications for admin with search
  async getNotifications(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        unread_only = false,
        search = '' // ✅ ADD search parameter
      } = req.query;

      const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      let whereConditions = [];
      let queryParams = [];

      if (unread_only === 'true') {
        whereConditions.push('n.is_read = false');
      }

      // ✅ ADD search functionality
      if (search && search.trim()) {
        whereConditions.push('(n.title LIKE ? OR n.message LIKE ?)');
        queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // ✅ ENHANCED query with tour/review details for better navigation
      const query = `
        SELECT 
          n.*,
          CASE 
            WHEN n.related_type = 'tour' AND n.type = 'review' THEN tc.title
            ELSE NULL
          END as tour_title,
          CASE 
            WHEN n.related_type = 'tour' AND n.type = 'review' THEN c.name
            ELSE NULL
          END as city_name
        FROM notifications n
        LEFT JOIN tours t ON n.related_id = t.id AND n.related_type = 'tour'
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        LEFT JOIN cities c ON t.city_id = c.id
        ${whereClause}
        ORDER BY n.created_at DESC 
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      const [notifications] = await pool.execute(query, queryParams);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM notifications n 
        ${whereClause}
      `;
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

  // ✅ NEW: Delete notifications related to a specific review/comment
  async deleteNotificationsByRelatedId(relatedId, relatedType) {
    try {
      await pool.execute(
        'DELETE FROM notifications WHERE related_id = ? AND related_type = ?',
        [relatedId, relatedType]
      );
    } catch (error) {
      console.error('Error deleting related notifications:', error);
    }
  }

  // ✅ NEW: Auto-cleanup old read notifications (optional)
  async cleanupOldNotifications() {
    try {
      // Delete read notifications older than 30 days
      await pool.execute(`
        DELETE FROM notifications 
        WHERE is_read = true 
        AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

module.exports = new NotificationController();