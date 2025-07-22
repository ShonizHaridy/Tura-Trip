const { pool } = require('../config/database');
const fs = require('fs').promises;

class CitiesController {
  // Get all cities
  async getAllCities(req, res) {
    try {
      const { active_only = false, include_stats = false } = req.query;

      let query = `
        SELECT c.*${include_stats === 'true' ? `, 
          (SELECT COUNT(*) FROM tours t WHERE t.city_id = c.id AND t.status = 'active') as active_tours_count,
          (SELECT COUNT(*) FROM tours t WHERE t.city_id = c.id) as total_tours_count
        ` : ''}
        FROM cities c
      `;

      let queryParams = [];

      if (active_only === 'true') {
        query += ' WHERE c.is_active = true';
      }

      query += ' ORDER BY c.name ASC';

      const [cities] = await pool.execute(query, queryParams);

      res.json({
        success: true,
        data: cities
      });
    } catch (error) {
      console.error('Get all cities error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get city by ID
  async getCityById(req, res) {
    try {
      const { id } = req.params;
      const { include_tours = false } = req.query;

      const [cityRows] = await pool.execute(
        'SELECT * FROM cities WHERE id = ?',
        [id]
      );

      if (cityRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      const city = cityRows[0];

      if (include_tours === 'true') {
        // Get tours for this city
        const [tours] = await pool.execute(`
          SELECT 
            t.*,
            tc.title,
            tc.category,
            tc.duration,
            cat.name as category_type,
            (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
            (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
          FROM tours t
          LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
          LEFT JOIN tour_categories cat ON t.category_id = cat.id
          WHERE t.city_id = ? AND t.status = 'active'
          ORDER BY t.created_at DESC
        `, [id]);

        city.tours = tours;
      }

      res.json({
        success: true,
        data: city
      });
    } catch (error) {
      console.error('Get city by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create city
  async createCity(req, res) {
    try {
      const { name, description } = req.body;
      const image = req.file?.filename || null;

      // Check if city already exists
      const [existingCity] = await pool.execute(
        'SELECT id FROM cities WHERE name = ?',
        [name]
      );

      if (existingCity.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'City already exists'
        });
      }

      const [result] = await pool.execute(`
        INSERT INTO cities (name, description, image, is_active) 
        VALUES (?, ?, ?, true)
      `, [name, description, image]);

      res.status(201).json({
        success: true,
        message: 'City created successfully',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Create city error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update city
  async updateCity(req, res) {
    try {
      const { id } = req.params;
      const { name, description, is_active } = req.body;

      // Check if city exists
      const [existingCity] = await pool.execute(
        'SELECT * FROM cities WHERE id = ?',
        [id]
      );

      if (existingCity.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      // Build update query
      const updateFields = [];
      const updateValues = [];

      if (name !== undefined) {
        // Check if name is already taken by another city
        const [nameExists] = await pool.execute(
          'SELECT id FROM cities WHERE name = ? AND id != ?',
          [name, id]
        );

        if (nameExists.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'City name already exists'
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

      if (req.file) {
        updateFields.push('image = ?');
        updateValues.push(req.file.filename);

        // Delete old image if exists
        if (existingCity[0].image) {
          try {
            await fs.unlink(`./uploads/${existingCity[0].image}`);
          } catch (fileError) {
            console.error('Error deleting old image:', fileError);
          }
        }
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
        `UPDATE cities SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'City updated successfully'
      });
    } catch (error) {
      console.error('Update city error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete city
  async deleteCity(req, res) {
    try {
      const { id } = req.params;

      // Check if city exists
      const [existingCity] = await pool.execute(
        'SELECT image FROM cities WHERE id = ?',
        [id]
      );

      if (existingCity.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      // Check if city has tours
      const [cityTours] = await pool.execute(
        'SELECT COUNT(*) as count FROM tours WHERE city_id = ?',
        [id]
      );

      if (cityTours[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete city with existing tours'
        });
      }

      // Delete city
      await pool.execute('DELETE FROM cities WHERE id = ?', [id]);

      // Delete image file if exists
      if (existingCity[0].image) {
        try {
          await fs.unlink(`./uploads/${existingCity[0].image}`);
        } catch (fileError) {
          console.error('Error deleting image file:', fileError);
        }
      }

      res.json({
        success: true,
        message: 'City deleted successfully'
      });
    } catch (error) {
      console.error('Delete city error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Toggle city status
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute(
        'UPDATE cities SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      res.json({
        success: true,
        message: 'City status updated successfully'
      });
    } catch (error) {
      console.error('Toggle city status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new CitiesController();