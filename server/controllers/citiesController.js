const { pool } = require('../config/database');
const fs = require('fs').promises;

const imageHelper = require('../utils/imageHelper');

class CitiesController {
  
  // Get all cities
  async getAllCities(req, res) {
    try {
      const { active_only = false } = req.query;

      // Always include stats for admin panel
      let query = `
        SELECT c.*,
          (SELECT COUNT(*) FROM tours t WHERE t.city_id = c.id AND t.status = 'active') as active_tours_count,
          (SELECT COUNT(*) FROM tours t WHERE t.city_id = c.id) as total_tours_count,
          c.name as original_name
        FROM cities c
      `;

      let queryParams = [];

      if (active_only === 'true') {
        query += ' WHERE c.is_active = true';
      }

      query += ' ORDER BY c.name ASC';

      const [cities] = await pool.execute(query, queryParams);
      
      // Process images and add computed fields
      let processedCities = cities.map(city => ({
        ...city,
        tours_count: city.active_tours_count, // Add this for frontend compatibility
        slug: city.slug || city.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') // Generate slug if missing
      }));

      // Process images
      processedCities = imageHelper.processArrayImages(processedCities, 'city');

      res.json({
        success: true,
        data: processedCities
      });
    } catch (error) {
      console.error('Get all cities error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

async getCityById(req, res) {
  try {
    const { id } = req.params;
    const { include_translations = false } = req.query;

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

    // Process image - FIX: Use consistent base URL
    if (city.image) {
      city.image_url = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${city.image}`;
    }

    if (include_translations === 'true') {
      // Get translations for this city
      const [translations] = await pool.execute(`
        SELECT language_code, name, tagline, description
        FROM city_translations 
        WHERE city_id = ?
      `, [id]);

      city.translations = {};
      translations.forEach(translation => {
        city.translations[translation.language_code] = {
          name: translation.name,
          tagline: translation.tagline,
          description: translation.description
        };
      });
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

// Update createCity method
async createCity(req, res) {
  try {
    const { is_active, translations } = req.body;
    const image = req.file?.filename || null;

    // Parse translations
    let translationsData;
    try {
      translationsData = typeof translations === 'string' ? JSON.parse(translations) : translations;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid translations format'
      });
    }

    // Validate that English translation has a name
    if (!translationsData?.en?.name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'English city name is required'
      });
    }

    // Get English name for main cities table
    const englishName = translationsData.en.name.trim();
    const englishDescription = translationsData.en.description || '';

    // Check if city already exists (English name)
    const [existingCity] = await pool.execute(
      'SELECT id FROM cities WHERE name = ?',
      [englishName]
    );

    if (existingCity.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'City already exists'
      });
    }

    // Convert is_active to boolean
    const isActive = is_active === 'true' || is_active === true;

    // Insert city with English name as primary name
    const [cityResult] = await pool.execute(`
      INSERT INTO cities (name, description, image, is_active) 
      VALUES (?, ?, ?, ?)
    `, [englishName, englishDescription, image, isActive]);

    const cityId = cityResult.insertId;

    // Insert ALL language translations (including English)
    for (const [langCode, langData] of Object.entries(translationsData)) {
      if (langData.name && langData.name.trim()) {
        await pool.execute(`
          INSERT INTO city_translations (city_id, language_code, name, tagline, description)
          VALUES (?, ?, ?, ?, ?)
        `, [cityId, langCode, langData.name.trim(), langData.tagline || '', langData.description || '']);
      }
    }

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: { id: cityId }
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
// Update updateCity method
async updateCity(req, res) {
  try {
    const { id } = req.params;
    const { is_active, translations } = req.body;

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

    // Parse translations if provided
    let translationsData;
    if (translations) {
      try {
        translationsData = typeof translations === 'string' ? JSON.parse(translations) : translations;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid translations format'
        });
      }
    }

    // Update city basic info
    const updateFields = [];
    const updateValues = [];

    // Update English name as primary name if provided
    if (translationsData?.en?.name?.trim()) {
      const englishName = translationsData.en.name.trim();
      const englishDescription = translationsData.en.description || '';
      
      // Check if new English name conflicts with another city
      const [nameExists] = await pool.execute(
        'SELECT id FROM cities WHERE name = ? AND id != ?',
        [englishName, id]
      );

      if (nameExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'City name already exists'
        });
      }

      updateFields.push('name = ?', 'description = ?');
      updateValues.push(englishName, englishDescription);
    }

    if (is_active !== undefined) {
      const isActive = is_active === 'true' || is_active === true;
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
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

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await pool.execute(
        `UPDATE cities SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update translations if provided
    if (translationsData) {
      for (const [langCode, langData] of Object.entries(translationsData)) {
        if (langData.name && langData.name.trim()) {
          await pool.execute(`
            INSERT INTO city_translations (city_id, language_code, name, tagline, description)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            tagline = VALUES(tagline),
            description = VALUES(description)
          `, [id, langCode, langData.name.trim(), langData.tagline || '', langData.description || '']);
        }
      }
    }

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