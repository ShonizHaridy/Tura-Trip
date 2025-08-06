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

 async createCategory(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { translations, is_active = true } = req.body;
      
      if (!translations || typeof translations !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Translations are required for all languages'
        });
      }

      // Validate that all required languages are provided
      const requiredLanguages = ['en', 'ru', 'it', 'de'];
      for (const lang of requiredLanguages) {
        if (!translations[lang] || !translations[lang].name || !translations[lang].name.trim()) {
          return res.status(400).json({
            success: false,
            message: `${lang.toUpperCase()} translation name is required`
          });
        }
      }

      // Check if English name already exists in main table
      const [existingEnCategory] = await connection.execute(
        'SELECT id FROM tour_categories WHERE name = ?',
        [translations.en.name.trim()]
      );

      if (existingEnCategory.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Category name "${translations.en.name}" already exists`
        });
      }

      // Check if other language names already exist in translations table
      for (const lang of ['ru', 'it', 'de']) {
        const [existingTranslation] = await connection.execute(
          'SELECT category_id FROM tour_category_translations WHERE name = ? AND language_code = ?',
          [translations[lang].name.trim(), lang]
        );

        if (existingTranslation.length > 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: `Category name "${translations[lang].name}" already exists in ${lang.toUpperCase()}`
          });
        }
      }

      // Create main category record with English data
      const [categoryResult] = await connection.execute(
        'INSERT INTO tour_categories (name, description, is_active) VALUES (?, ?, ?)',
        [
          translations.en.name.trim(),
          translations.en.description || '',
          is_active
        ]
      );

      const categoryId = categoryResult.insertId;

      // Create translations for other languages (ru, it, de)
      for (const lang of ['ru', 'it', 'de']) {
        await connection.execute(
          `INSERT INTO tour_category_translations (category_id, language_code, name, description) 
           VALUES (?, ?, ?, ?)`,
          [
            categoryId,
            lang,
            translations[lang].name.trim(),
            translations[lang].description || ''
          ]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { id: categoryId }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
    }
  }

  async updateCategory(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;
      const { translations, is_active } = req.body;

      // Check if category exists
      const [existingCategory] = await connection.execute(
        'SELECT * FROM tour_categories WHERE id = ?',
        [id]
      );

      if (existingCategory.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Update translations if provided
      if (translations && typeof translations === 'object') {
        // Update English in main table
        if (translations.en && translations.en.name && translations.en.name.trim()) {
          // Check if English name already exists for other categories
          const [existingEnName] = await connection.execute(
            'SELECT id FROM tour_categories WHERE name = ? AND id != ?',
            [translations.en.name.trim(), id]
          );

          if (existingEnName.length > 0) {
            await connection.rollback();
            return res.status(400).json({
              success: false,
              message: `Category name "${translations.en.name}" already exists`
            });
          }

          // Update main table with English data
          await connection.execute(
            'UPDATE tour_categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [
              translations.en.name.trim(),
              translations.en.description || '',
              id
            ]
          );
        }

        // Update other languages in translations table
        for (const lang of ['ru', 'it', 'de']) {
          if (translations[lang] && translations[lang].name && translations[lang].name.trim()) {
            // Check if translation name already exists for other categories
            const [existingTranslation] = await connection.execute(
              'SELECT category_id FROM tour_category_translations WHERE name = ? AND language_code = ? AND category_id != ?',
              [translations[lang].name.trim(), lang, id]
            );

            if (existingTranslation.length > 0) {
              await connection.rollback();
              return res.status(400).json({
                success: false,
                message: `Category name "${translations[lang].name}" already exists in ${lang.toUpperCase()}`
              });
            }

            // Update or insert translation
            await connection.execute(
              `INSERT INTO tour_category_translations (category_id, language_code, name, description) 
               VALUES (?, ?, ?, ?) 
               ON DUPLICATE KEY UPDATE 
               name = VALUES(name), 
               description = VALUES(description)`,
              [
                id,
                lang,
                translations[lang].name.trim(),
                translations[lang].description || ''
              ]
            );
          }
        }
      }

      // Update is_active if provided
      if (is_active !== undefined) {
        await connection.execute(
          'UPDATE tour_categories SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [is_active, id]
        );
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Category updated successfully'
      });

    } catch (error) {
      await connection.rollback();
      console.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
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