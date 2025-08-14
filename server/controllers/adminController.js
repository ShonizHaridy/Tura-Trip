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
    console.log('🔍 Forgot password request:', req.body);
    const { admin_id, email } = req.body;
    console.log('🔍 Forgot password attempt:', { admin_id, email });
    
    // Query using admin_id (which exists in database)
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM admin_users WHERE admin_id = ? AND email = ? AND is_active = true',
      [admin_id, email]
    );
    
    console.log('🔍 Found admin users:', rows.length);
    
    if (rows.length > 0) {
      const adminDbId = rows[0].id;
      const adminName = rows[0].name;
      const adminEmail = rows[0].email;
      
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log('📧 Generated verification code:', verificationCode);
      console.log('👤 Admin DB ID:', adminDbId);
      
      // Use MySQL for consistent timestamps
      await pool.execute(`
        INSERT INTO password_resets (admin_id, verification_code, expires_at, created_at) 
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), NOW()) 
        ON DUPLICATE KEY UPDATE 
          verification_code = ?, 
          expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE), 
          created_at = NOW()
      `, [adminDbId, verificationCode, verificationCode]);
      
      // Verify OTP was stored
      const [verifyResult] = await pool.execute(`
        SELECT 
          admin_id, 
          verification_code, 
          expires_at, 
          created_at,
          TIMESTAMPDIFF(MINUTE, created_at, expires_at) as duration_minutes
        FROM password_resets 
        WHERE admin_id = ?
      `, [adminDbId]);
      
      if (verifyResult.length > 0) {
        console.log('✅ OTP stored with consistent timestamps:', {
          admin_id: verifyResult[0].admin_id,
          verification_code: verifyResult[0].verification_code,
          created_at: verifyResult[0].created_at,
          expires_at: verifyResult[0].expires_at,
          duration_minutes: verifyResult[0].duration_minutes
        });
      }
      
      // Send verification code email
      const emailService = require('../services/emailService');
      await emailService.sendPasswordResetCode({
        email: adminEmail,
        name: adminName,
        verificationCode: verificationCode
      });
      
      console.log('✅ Password reset code sent successfully');
      
      // ✅ SUCCESS: Return success - proceed to next step
      return res.json({
        success: true,
        message: 'Verification code has been sent to your email address.'
      });
      
    } else {
      console.log('❌ No admin found with provided credentials');
      
      // ✅ FAILURE: Return error - stay on current page
      return res.status(404).json({
        success: false,
        message: 'No admin account found with the provided Admin ID and email combination.'
      });
    }
    
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.'
    });
  }
}

async resetPassword(req, res) {
  try {
    const { admin_id, email, verification_code, new_password } = req.body; // ✅ Changed from admin_code to admin_id

    console.log('🔍 Reset password attempt:', { admin_id, email, verification_code });

    // ✅ Query using admin_id (which exists in database)
    const [adminRows] = await pool.execute(
      'SELECT id FROM admin_users WHERE admin_id = ? AND email = ? AND is_active = true',
      [admin_id, email]
    );

    if (adminRows.length === 0) {
      console.log('❌ No admin found with provided credentials');
      return res.status(404).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const adminDbId = adminRows[0].id; // ✅ This is the database ID (primary key)

    // Verify verification code
    const [codeRows] = await pool.execute(
      'SELECT * FROM password_resets WHERE admin_id = ? AND verification_code = ? AND expires_at > NOW()',
      [adminDbId, verification_code]
    );

    if (codeRows.length === 0) {
      console.log('❌ Invalid or expired verification code');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Hash new password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(new_password, 12);

    // Update password
    await pool.execute(
      'UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, adminDbId]
    );

    // Delete used verification code
    await pool.execute(
      'DELETE FROM password_resets WHERE admin_id = ?',
      [adminDbId]
    );

    console.log('✅ Password reset successfully');

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
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
  // Enhanced getDashboardStats method
  async getDashboardStats(req, res) {
    try {
      const imageHelper = require('../utils/imageHelper'); // Add this import

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

      // Get total categories count
      const [totalCategoriesResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM tour_categories WHERE is_active = true'
      );

      // Get tours by status breakdown
      const [statusBreakdown] = await pool.execute(`
        SELECT 
          status, 
          COUNT(*) as count 
        FROM tours 
        GROUP BY status
      `);

      // Get categories with tour counts
      const [categoriesStats] = await pool.execute(`
        SELECT 
          tc.id,
          tc.name,
          tc.is_active,
          COUNT(t.id) as tours_count,
          COUNT(CASE WHEN t.status = 'active' THEN 1 END) as active_tours_count
        FROM tour_categories tc
        LEFT JOIN tours t ON tc.id = t.category_id
        WHERE tc.is_active = true
        GROUP BY tc.id, tc.name, tc.is_active
        ORDER BY tours_count DESC
        LIMIT 10
      `);

      // Get recent tours with complete details
      const [recentTours] = await pool.execute(`
        SELECT 
          t.id,
          t.price_adult,
          t.price_child,
          t.status,
          t.cover_image,
          t.created_at,
          t.updated_at,
          tc.title,
          tc.category,
          c.name as city_name,
          c.id as city_id,
          cat.name as category_name,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        ORDER BY t.created_at DESC
        LIMIT 5
      `);

      // Process recent tours images
      const processedRecentTours = imageHelper.processArrayImages(recentTours, 'tour');

      // Get monthly stats (last 6 months)
      const [monthlyStats] = await pool.execute(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          DATE_FORMAT(created_at, '%M %Y') as month_name,
          COUNT(*) as tours_created
        FROM tours
        WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%M %Y')
        ORDER BY month DESC
      `);

      // Get recent activities (tours, reviews, etc.)
      const [recentActivities] = await pool.execute(`
        (SELECT 'tour' as type, t.id, tc.title as name, t.created_at, 'created' as action
        FROM tours t 
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        ORDER BY t.created_at DESC LIMIT 3)
        UNION ALL
        (SELECT 'review' as type, r.id, CONCAT('Review for tour #', r.tour_id) as name, r.created_at, 'submitted' as action
        FROM reviews r 
        WHERE r.is_active = true
        ORDER BY r.created_at DESC LIMIT 3)
        ORDER BY created_at DESC
        LIMIT 10
      `);

      const stats = {
        totalTours: totalToursResult[0].count,
        activeTours: activeToursResult[0].count,
        totalCities: totalCitiesResult[0].count,
        totalReviews: totalReviewsResult[0].count,
        totalCategories: totalCategoriesResult[0].count,
        recentTours: processedRecentTours,
        statusBreakdown,
        categoriesStats,
        monthlyStats,
        recentActivities
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