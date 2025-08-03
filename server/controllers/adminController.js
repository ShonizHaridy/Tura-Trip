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


  async forgotPassword(req, res) {
    try {
      const { admin_code, email, id_number } = req.body;

      // Verify admin exists with provided credentials
      const [rows] = await pool.execute(
        'SELECT id, name, email FROM admin_users WHERE admin_code = ? AND email = ? AND id_number = ? AND is_active = true',
        [admin_code, email, id_number]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found with provided credentials'
        });
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store verification code in database (you may need to create a password_resets table)
      await pool.execute(
        'INSERT INTO password_resets (admin_id, verification_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE verification_code = ?, expires_at = ?',
        [rows[0].id, verificationCode, expiresAt, verificationCode, expiresAt]
      );

      // Send verification code email using your existing email service
      const emailService = require('../services/emailService');
      await emailService.sendPasswordResetCode({
        email: email,
        name: rows[0].name,
        verificationCode: verificationCode
      });

      res.json({
        success: true,
        message: 'Verification code sent to your email'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { admin_code, email, id_number, verification_code, new_password } = req.body;

      // Verify admin and get admin ID
      const [adminRows] = await pool.execute(
        'SELECT id FROM admin_users WHERE admin_code = ? AND email = ? AND id_number = ? AND is_active = true',
        [admin_code, email, id_number]
      );

      if (adminRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      const adminId = adminRows[0].id;

      // Verify verification code
      const [codeRows] = await pool.execute(
        'SELECT * FROM password_resets WHERE admin_id = ? AND verification_code = ? AND expires_at > NOW()',
        [adminId, verification_code]
      );

      if (codeRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 12);

      // Update password
      await pool.execute(
        'UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, adminId]
      );

      // Delete used verification code
      await pool.execute(
        'DELETE FROM password_resets WHERE admin_id = ?',
        [adminId]
      );

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
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