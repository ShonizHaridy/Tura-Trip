const { pool } = require('../config/database');

class CategoriesController {
  // Get all categories
  async getAllCategories(req, res) {
    try {
      const { active_only = false, include_stats = false } = req.query;

      let query = `
        SELECT tc.*${include_stats === 'true' ? `, 
          (SELECT COUNT(*) FROM tours t WHERE t.category_id = tc.id AND t.status = 'active') as active_tours_count,
          (SELECT COUNT(*) FROM tours t WHERE t.category_id = tc.id) as total_tours_count
        ` : ''}
        FROM tour_categories tc
      `;

      if (active_only === 'true') {
        query += ' WHERE tc.is_active = true';
      }

      query += ' ORDER BY tc.name ASC';

      const [categories] = await pool.execute(query);

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get all categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get category by ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const { include_tours = false } = req.query;

      const [categoryRows] = await pool.execute(
        'SELECT * FROM tour_categories WHERE id = ?',
        [id]
      );

      if (categoryRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const category = categoryRows[0];

      if (include_tours === 'true') {
        const [tours] = await pool.execute(`
          SELECT 
            t.*,
            tc.title,
            tc.duration,
            c.name as city_name,
            (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating
          FROM tours t
          LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
          LEFT JOIN cities c ON t.city_id = c.id
          WHERE t.category_id = ? AND t.status = 'active'
          ORDER BY t.created_at DESC
        `, [id]);

        category.tours = tours;
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Get category by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create category
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;

      const [existingCategory] = await pool.execute(
        'SELECT id FROM tour_categories WHERE name = ?',
        [name]
      );

      if (existingCategory.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Category already exists'
        });
      }

      const [result] = await pool.execute(`
        INSERT INTO tour_categories (name, description, is_active) 
        VALUES (?, ?, true)
      `, [name, description]);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update category
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, is_active } = req.body;

      const [existingCategory] = await pool.execute(
        'SELECT * FROM tour_categories WHERE id = ?',
        [id]
      );

      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (name !== undefined) {
        const [nameExists] = await pool.execute(
          'SELECT id FROM tour_categories WHERE name = ? AND id != ?',
          [name, id]
        );

        if (nameExists.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Category name already exists'
          });
        }

        updateFields.push('name = ?');
        updateValues.push(name);
      }

      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }

      if (is_active !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(is_active);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await pool.execute(
        `UPDATE tour_categories SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Category updated successfully'
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete category
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const [existingCategory] = await pool.execute(
        'SELECT * FROM tour_categories WHERE id = ?',
        [id]
      );

      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const [categoryTours] = await pool.execute(
        'SELECT COUNT(*) as count FROM tours WHERE category_id = ?',
        [id]
      );

      if (categoryTours[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with existing tours'
        });
      }

      await pool.execute('DELETE FROM tour_categories WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Toggle category status
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute(
        'UPDATE tour_categories SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        message: 'Category status updated successfully'
      });
    } catch (error) {
      console.error('Toggle category status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new CategoriesController();