const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const jwtConfig = require('../config/jwt');

class AdminController {
  // Admin login
async login(req, res) {
  try {
    const { email, admin_id, password } = req.body;
    
    // Build query to accept either email or admin_id
    let query = 'SELECT * FROM admin_users WHERE ';
    let params = [];
    
    if (email) {
      query += 'email = ? AND is_active = true';
      params.push(email);
    } else if (admin_id) {
      // Check both admin_id and email fields for the provided value
      query += '(admin_id = ? OR email = ?) AND is_active = true';
      params.push(admin_id, admin_id);
    }

    console.log('🔍 Login attempt:', { email, admin_id, query, params });

    const [rows] = await pool.execute(query, params);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.execute(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Remove password from response
    const { password_hash, ...adminData } = admin;

    console.log('✅ Login successful for:', adminData.admin_id || adminData.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: adminData,
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

  // Get admin profile
  async getProfile(req, res) {
    try {
      const { password_hash, ...adminData } = req.admin;
      
      res.json({
        success: true,
        data: adminData
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update admin profile
  async updateProfile(req, res) {
    try {
      const { name, email, currentPassword, newPassword } = req.body;
      const adminId = req.admin.id;

      // Validate current password if updating password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is required to set new password'
          });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, req.admin.password_hash);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
      }

      // Prepare update fields
      let updateFields = [];
      let updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }

      if (email && email !== req.admin.email) {
        // Check if email already exists
        const [existingUsers] = await pool.execute(
          'SELECT id FROM admin_users WHERE email = ? AND id != ?',
          [email, adminId]
        );

        if (existingUsers.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }

        updateFields.push('email = ?');
        updateValues.push(email);
      }

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        updateFields.push('password_hash = ?');
        updateValues.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(adminId);

      // Update admin
      await pool.execute(
        `UPDATE admin_users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Get updated admin data
      const [updatedRows] = await pool.execute(
        'SELECT * FROM admin_users WHERE id = ?',
        [adminId]
      );

      const { password_hash, ...adminData } = updatedRows[0];

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: adminData
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Verify token
  async verifyToken(req, res) {
    try {
      const { password_hash, ...adminData } = req.admin;
      
      res.json({
        success: true,
        data: adminData
      });
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      // Get total tours count
      const [totalToursResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM tours'
      );

      // Get active tours count
      const [activeToursResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM tours WHERE status = "active"'
      );

      // Get total cities count
      const [totalCitiesResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM cities WHERE is_active = true'
      );

      // Get total reviews count
      const [totalReviewsResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM reviews WHERE is_active = true'
      );

      // Get recent tours
      const [recentTours] = await pool.execute(`
        SELECT t.*, tc.title, tc.category, c.name as city_name 
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        LEFT JOIN cities c ON t.city_id = c.id
        ORDER BY t.created_at DESC
        LIMIT 5
      `);

      const stats = {
        totalTours: totalToursResult[0].count,
        activeTours: activeToursResult[0].count,
        totalCities: totalCitiesResult[0].count,
        totalReviews: totalReviewsResult[0].count,
        recentTours
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AdminController();