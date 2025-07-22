const { pool } = require('../config/database');
const fs = require('fs').promises;

class ToursController {
  // Get all tours with filters and pagination
// Get all tours with filters and pagination
async getAllTours(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      city_id,
      category_id,
      status,
      featured_tag,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    console.log('📥 Request params:', { page, limit, search, city_id, category_id, status, featured_tag });

    // Convert to safe integers
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeOffset = (safePage - 1) * safeLimit;

    // Build WHERE conditions with parameters (for user input only)
    let whereConditions = [];
    let whereParams = [];

    if (search && search.trim() !== '') {
      whereConditions.push('(tc.title LIKE ? OR c.name LIKE ? OR cat.name LIKE ?)');
      whereParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (city_id) {
      whereConditions.push('t.city_id = ?');
      whereParams.push(parseInt(city_id));
    }

    if (category_id) {
      whereConditions.push('t.category_id = ?');
      whereParams.push(parseInt(category_id));
    }

    if (status && ['active', 'inactive', 'draft'].includes(status)) {
      whereConditions.push('t.status = ?');
      whereParams.push(status);
    }

    if (featured_tag && ['popular', 'great_value', 'new'].includes(featured_tag)) {
      whereConditions.push('t.featured_tag = ?');
      whereParams.push(featured_tag);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Safe ORDER BY (no user input, so safe to concatenate)
    const validSorts = ['created_at', 'price_adult', 'views', 'id'];
    const safeSortBy = validSorts.includes(sort_by) ? sort_by : 'created_at';
    const safeSortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // STEP 1: Count query (only WHERE parameters)
    const countQuery = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM tours t
      LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN tour_categories cat ON t.category_id = cat.id
      ${whereClause}
    `;

    console.log('📊 Count query:', countQuery);
    console.log('📊 Count params:', whereParams);

    const [countResult] = await pool.execute(countQuery, whereParams);
    const totalTours = countResult[0].total;

    console.log('✅ Count succeeded, total:', totalTours);

    // STEP 2: Main query (string concatenation for LIMIT/OFFSET to avoid driver issues)
    const toursQuery = `
      SELECT 
        t.id,
        t.city_id,
        t.category_id,
        t.location,
        t.price_adult,
        t.price_child,
        t.featured_tag,
        t.discount_percentage,
        t.status,
        t.views,
        t.cover_image,
        t.created_at,
        t.updated_at,
        tc.title,
        tc.category as category_name,
        tc.duration,
        c.name as city_name,
        cat.name as category_type
      FROM tours t
      LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN tour_categories cat ON t.category_id = cat.id
      ${whereClause}
      ORDER BY t.${safeSortBy} ${safeSortOrder}
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;

    console.log('🎯 Tours query:', toursQuery);
    console.log('🎯 Tours params:', whereParams);

    // Execute with only WHERE parameters (LIMIT/OFFSET are safely built into string)
    const [tours] = await pool.execute(toursQuery, whereParams);

    console.log('✅ Tours query succeeded, found:', tours.length, 'tours');

    res.json({
      success: true,
      data: {
        tours,
        pagination: {
          currentPage: safePage,
          totalPages: Math.ceil(totalTours / safeLimit),
          totalItems: totalTours,
          itemsPerPage: safeLimit
        }
      }
    });

  } catch (error) {
    console.error('❌ Get all tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get single tour by ID
async getTourById(req, res) {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    // Get tour basic info
    const [tourRows] = await pool.execute(`
      SELECT
        t.*,
        c.name as city_name,
        cat.name as category_type
      FROM tours t
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN tour_categories cat ON t.category_id = cat.id
      WHERE t.id = ?
    `, [id]);

    if (tourRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    const tour = tourRows[0];

    // Get tour content for all languages
    const [contentRows] = await pool.execute(
      'SELECT * FROM tour_content WHERE tour_id = ?',
      [id]
    );

    // Get tour images
    const [imageRows] = await pool.execute(
      'SELECT * FROM tour_images WHERE tour_id = ? ORDER BY id',
      [id]
    );

    // Get reviews
    const [reviewRows] = await pool.execute(`
      SELECT * FROM reviews
      WHERE tour_id = ? AND is_active = true
      ORDER BY review_date DESC
    `, [id]);

    // Organize content by language (with safe JSON parsing)
    const content = {};
    contentRows.forEach(row => {

      // Safe JSON parsing with fallbacks
      const parseJSONSafe = (jsonString) => {
        if (!jsonString) return [];
        
        // If it's already an array, return it
        if (Array.isArray(jsonString)) return jsonString;
        
        try {
          // First try normal JSON parsing
          return JSON.parse(jsonString);
        } catch (error) {
          console.warn('🔴 Invalid JSON, trying alternative parsing:', jsonString);
          
          try {
            // Try to fix common JSON issues
            let fixedJson = jsonString
              .replace(/'/g, '"')  // Replace single quotes with double quotes
              .replace(/[\r\n\t]/g, '')  // Remove line breaks and tabs
              .trim();
            
            return JSON.parse(fixedJson);
          } catch (error2) {
            console.warn('🔴 Alternative parsing failed, extracting manually:', jsonString);
            
            // Manual extraction as last resort
            if (typeof jsonString === 'string' && jsonString.includes('"')) {
              // Extract items between quotes
              const matches = jsonString.match(/"([^"]*)"/g);
              return matches ? matches.map(match => match.replace(/"/g, '')) : [jsonString];
            }
            
            // Fallback: return as single item array
            return [jsonString.toString()];
          }
        }
      };

      content[row.language_code] = {
        title: row.title,
        category: row.category,
        duration: row.duration,
        availability: row.availability,
        description: row.description,
        included: parseJSONSafe(row.included),
        not_included: parseJSONSafe(row.not_included),
        trip_program: parseJSONSafe(row.trip_program),
        take_with_you: parseJSONSafe(row.take_with_you)
      };
    });

    // Calculate average rating
    const avgRating = reviewRows.length > 0
      ? reviewRows.reduce((sum, review) => sum + review.rating, 0) / reviewRows.length
      : 0;

    res.json({
      success: true,
      data: {
        tour,
        content,
        images: imageRows,
        reviews: reviewRows,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewsCount: reviewRows.length
      }
    });
  } catch (error) {
    console.error('❌ Get tour by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
  // Create new tour
  async createTour(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        city_id,
        category_id,
        location,
        price_adult,
        price_child,
        featured_tag = null,
        discount_percentage = 0,
        status = 'active',
        content = {},
        images = []
      } = req.body;

      // Insert tour
      const [tourResult] = await connection.execute(`
        INSERT INTO tours (
          city_id, category_id, location, price_adult, price_child,
          featured_tag, discount_percentage, status, cover_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        city_id, category_id, location, price_adult, price_child,
        featured_tag, discount_percentage, status, req.file?.filename || null
      ]);

      const tourId = tourResult.insertId;

      // Insert content for each language
      for (const [langCode, langContent] of Object.entries(content)) {
        if (langContent.title) { // Only insert if title exists
          await connection.execute(`
            INSERT INTO tour_content (
              tour_id, language_code, title, category, duration, 
              availability, description, included, not_included, 
              trip_program, take_with_you
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            tourId, langCode, langContent.title, langContent.category,
            langContent.duration, langContent.availability, langContent.description,
            JSON.stringify(langContent.included || []),
            JSON.stringify(langContent.not_included || []),
            JSON.stringify(langContent.trip_program || []),
            JSON.stringify(langContent.take_with_you || [])
          ]);
        }
      }

      // Insert additional images if provided
      if (req.files?.length > 0) {
        for (const file of req.files) {
          await connection.execute(
            'INSERT INTO tour_images (tour_id, image_url) VALUES (?, ?)',
            [tourId, file.filename]
          );
        }
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Tour created successfully',
        data: { id: tourId }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Create tour error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
    }
  }

  // Update tour
  async updateTour(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const {
        city_id,
        category_id,
        location,
        price_adult,
        price_child,
        featured_tag,
        discount_percentage,
        status,
        content = {},
        removeImages = []
      } = req.body;

      // Check if tour exists
      const [existingTour] = await connection.execute(
        'SELECT * FROM tours WHERE id = ?',
        [id]
      );

      if (existingTour.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      // Update tour basic info
      const updateFields = [];
      const updateValues = [];

      if (city_id !== undefined) {
        updateFields.push('city_id = ?');
        updateValues.push(city_id);
      }
      if (category_id !== undefined) {
        updateFields.push('category_id = ?');
        updateValues.push(category_id);
      }
      if (location !== undefined) {
        updateFields.push('location = ?');
        updateValues.push(location);
      }
      if (price_adult !== undefined) {
        updateFields.push('price_adult = ?');
        updateValues.push(price_adult);
      }
      if (price_child !== undefined) {
        updateFields.push('price_child = ?');
        updateValues.push(price_child);
      }
      if (featured_tag !== undefined) {
        updateFields.push('featured_tag = ?');
        updateValues.push(featured_tag);
      }
      if (discount_percentage !== undefined) {
        updateFields.push('discount_percentage = ?');
        updateValues.push(discount_percentage);
      }
      if (status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }
      if (req.file) {
        updateFields.push('cover_image = ?');
        updateValues.push(req.file.filename);
      }

      if (updateFields.length > 0) {
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);

        await connection.execute(
          `UPDATE tours SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }

      // Update content for each language
      for (const [langCode, langContent] of Object.entries(content)) {
        if (langContent.title) {
          // Check if content exists
          const [existingContent] = await connection.execute(
            'SELECT id FROM tour_content WHERE tour_id = ? AND language_code = ?',
            [id, langCode]
          );

          if (existingContent.length > 0) {
            // Update existing content
            await connection.execute(`
              UPDATE tour_content SET
                title = ?, category = ?, duration = ?, availability = ?,
                description = ?, included = ?, not_included = ?,
                trip_program = ?, take_with_you = ?
              WHERE tour_id = ? AND language_code = ?
            `, [
              langContent.title, langContent.category, langContent.duration,
              langContent.availability, langContent.description,
              JSON.stringify(langContent.included || []),
              JSON.stringify(langContent.not_included || []),
              JSON.stringify(langContent.trip_program || []),
              JSON.stringify(langContent.take_with_you || []),
              id, langCode
            ]);
          } else {
            // Insert new content
            await connection.execute(`
              INSERT INTO tour_content (
                tour_id, language_code, title, category, duration,
                availability, description, included, not_included,
                trip_program, take_with_you
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              id, langCode, langContent.title, langContent.category,
              langContent.duration, langContent.availability, langContent.description,
              JSON.stringify(langContent.included || []),
              JSON.stringify(langContent.not_included || []),
              JSON.stringify(langContent.trip_program || []),
              JSON.stringify(langContent.take_with_you || [])
            ]);
          }
        }
      }

      // Handle image removal
      if (removeImages.length > 0) {
        for (const imageId of removeImages) {
          // Get image filename before deletion
          const [imageRow] = await connection.execute(
            'SELECT image_url FROM tour_images WHERE id = ? AND tour_id = ?',
            [imageId, id]
          );

          if (imageRow.length > 0) {
            // Delete file from filesystem
            try {
              await fs.unlink(`./uploads/${imageRow[0].image_url}`);
            } catch (fileError) {
              console.error('Error deleting file:', fileError);
            }

            // Delete from database
            await connection.execute(
              'DELETE FROM tour_images WHERE id = ? AND tour_id = ?',
              [imageId, id]
            );
          }
        }
      }

      // Add new images
      if (req.files?.length > 0) {
        for (const file of req.files) {
          await connection.execute(
            'INSERT INTO tour_images (tour_id, image_url) VALUES (?, ?)',
            [id, file.filename]
          );
        }
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Tour updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      console.error('Update tour error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
    }
  }

  // Delete tour
  async deleteTour(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;

      // Check if tour exists
      const [existingTour] = await connection.execute(
        'SELECT cover_image FROM tours WHERE id = ?',
        [id]
      );

      if (existingTour.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      // Get all tour images
      const [tourImages] = await connection.execute(
        'SELECT image_url FROM tour_images WHERE tour_id = ?',
        [id]
      );

      // Delete tour (cascade will handle related records)
      await connection.execute('DELETE FROM tours WHERE id = ?', [id]);

      // Delete image files
      const imagesToDelete = [
        ...tourImages.map(img => img.image_url),
        existingTour[0].cover_image
      ].filter(Boolean);

      for (const imageUrl of imagesToDelete) {
        try {
          await fs.unlink(`./uploads/${imageUrl}`);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
        }
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Tour deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      console.error('Delete tour error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
    }
  }

  // Update tour status
  async updateTourStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive', 'draft'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const [result] = await pool.execute(
        'UPDATE tours SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      res.json({
        success: true,
        message: 'Tour status updated successfully'
      });
    } catch (error) {
      console.error('Update tour status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Increment tour views
  async incrementViews(req, res) {
    try {
      const { id } = req.params;

      await pool.execute(
        'UPDATE tours SET views = views + 1 WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Views incremented'
      });
    } catch (error) {
      console.error('Increment views error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ToursController();