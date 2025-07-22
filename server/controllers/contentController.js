const { pool } = require('../config/database');

class ContentController {
  // ==== FAQ MANAGEMENT ====

  // Get all FAQs with translations
  async getAllFAQs(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        language_code,
        active_only = false
      } = req.query;

      // Safe pagination values
      const safeLimit = Math.max(1, Math.min(100, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      let whereConditions = [];
      let queryParams = [];

      if (active_only === 'true') {
        whereConditions.push('f.is_active = true');
      }

      if (language_code) {
        // Get FAQs for specific language
        whereConditions.push('ft.language_code = ?');
        queryParams.push(language_code);

        const whereClause = whereConditions.length > 0 
          ? `WHERE ${whereConditions.join(' AND ')}` 
          : '';

        const query = `
          SELECT 
            f.id,
            f.is_active,
            f.display_order,
            f.created_at,
            f.updated_at,
            ft.question,
            ft.answer
          FROM faqs f
          INNER JOIN faq_translations ft ON f.id = ft.faq_id
          ${whereClause}
          ORDER BY f.display_order ASC, f.created_at DESC
          LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;

        console.log('🔍 FAQ Query (specific language):', query);
        console.log('🔍 FAQ Params:', queryParams);

        const [faqs] = await pool.execute(query, queryParams);
        
        res.json({
          success: true,
          data: faqs
        });
      } else {
        // Get all FAQs with all translations for admin (simplified approach)
        const whereClause = whereConditions.length > 0 
          ? `WHERE ${whereConditions.join(' AND ')}` 
          : '';

        // First get the basic FAQ info
        const mainQuery = `
          SELECT 
            f.id,
            f.is_active,
            f.display_order,
            f.created_at,
            f.updated_at
          FROM faqs f
          ${whereClause}
          ORDER BY f.display_order ASC, f.created_at DESC
          LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;

        console.log('🔍 FAQ Main Query:', mainQuery);
        console.log('🔍 FAQ Main Params:', queryParams);

        const [mainFAQs] = await pool.execute(mainQuery, queryParams);

        // Then get translations for each FAQ
        const faqsWithTranslations = [];

        for (const faq of mainFAQs) {
          // Get all translations for this FAQ
          const [translations] = await pool.execute(
            'SELECT language_code, question, answer FROM faq_translations WHERE faq_id = ?',
            [faq.id]
          );

          // Organize translations by language
          const translationsObj = {};
          translations.forEach(trans => {
            translationsObj[trans.language_code] = {
              question: trans.question,
              answer: trans.answer
            };
          });

          faqsWithTranslations.push({
            ...faq,
            translations: translationsObj
          });
        }

        // Get total count for pagination
        const countQuery = `SELECT COUNT(*) as total FROM faqs f ${whereClause}`;
        const [countResult] = await pool.execute(countQuery, queryParams);
        const totalFAQs = countResult[0].total;

        res.json({
          success: true,
          data: {
            faqs: faqsWithTranslations,
            pagination: {
              currentPage: safePage,
              totalPages: Math.ceil(totalFAQs / safeLimit),
              totalItems: totalFAQs,
              itemsPerPage: safeLimit
            }
          }
        });
      }
    } catch (error) {
      console.error('❌ Get all FAQs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  // Get FAQ by ID
  async getFAQById(req, res) {
    try {
      const { id } = req.params;

      // Get main FAQ info
      const [faqRows] = await pool.execute(
        'SELECT * FROM faqs WHERE id = ?',
        [id]
      );

      if (faqRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      // Get all translations for this FAQ
      const [translations] = await pool.execute(
        'SELECT language_code, question, answer FROM faq_translations WHERE faq_id = ?',
        [id]
      );

      // Organize translations
      const translationsObj = {};
      translations.forEach(trans => {
        translationsObj[trans.language_code] = {
          question: trans.question,
          answer: trans.answer
        };
      });

      res.json({
        success: true,
        data: {
          ...faqRows[0],
          translations: translationsObj
        }
      });
    } catch (error) {
      console.error('❌ Get FAQ by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  // Create FAQ with translations
  async createFAQ(req, res) {
    try {
      const { translations, is_active = true, display_order = 0 } = req.body;

      if (!translations || Object.keys(translations).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'FAQ translations are required'
        });
      }

      await pool.execute('START TRANSACTION');

      try {
        // Insert main FAQ
        const [faqResult] = await pool.execute(
          'INSERT INTO faq (is_active, display_order) VALUES (?, ?)',
          [is_active, display_order]
        );

        const faqId = faqResult.insertId;

        // Insert translations
        for (const [langCode, translation] of Object.entries(translations)) {
          const { question, answer } = translation;
          if (question && answer) {
            await pool.execute(
              'INSERT INTO faq_translations (faq_id, language_code, question, answer) VALUES (?, ?, ?, ?)',
              [faqId, langCode, question, answer]
            );
          }
        }

        await pool.execute('COMMIT');

        res.json({
          success: true,
          message: 'FAQ created successfully',
          data: { id: faqId }
        });
      } catch (error) {
        await pool.execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Create FAQ error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update FAQ
  async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const { translations, is_active, display_order } = req.body;

      // Check if FAQ exists
      const [existingFAQ] = await pool.execute(
        'SELECT * FROM faqs WHERE id = ?',
        [id]
      );

      if (existingFAQ.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      await pool.execute('START TRANSACTION');

      try {
        // Update main FAQ table
        let updateFields = [];
        let updateValues = [];

        if (is_active !== undefined) {
          updateFields.push('is_active = ?');
          updateValues.push(is_active);
        }

        if (display_order !== undefined) {
          updateFields.push('display_order = ?');
          updateValues.push(display_order);
        }

        if (updateFields.length > 0) {
          updateFields.push('updated_at = CURRENT_TIMESTAMP');
          updateValues.push(id);

          await pool.execute(
            `UPDATE faqs SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );
        }

        // Update translations if provided
        if (translations) {
          for (const [langCode, translation] of Object.entries(translations)) {
            const { question, answer } = translation;
            if (question && answer) {
              await pool.execute(`
                INSERT INTO faq_translations (faq_id, language_code, question, answer)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                question = VALUES(question),
                answer = VALUES(answer)
              `, [id, langCode, question, answer]);
            }
          }
        }

        await pool.execute('COMMIT');

        res.json({
          success: true,
          message: 'FAQ updated successfully'
        });
      } catch (error) {
        await pool.execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Update FAQ error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete FAQ
  async deleteFAQ(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute('DELETE FROM faqs WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      res.json({
        success: true,
        message: 'FAQ deleted successfully'
      });
    } catch (error) {
      console.error('❌ Delete FAQ error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // ==== REVIEWS MANAGEMENT ====

  // Get all reviews
  async getAllReviews(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        tour_id,
        rating,
        active_only = false
      } = req.query;

      // Safe system values
      const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const safePage = Math.max(1, parseInt(page) || 1);
      const safeOffset = (safePage - 1) * safeLimit;

      // Build WHERE conditions (user input only)
      let whereConditions = [];
      let whereParams = [];

      if (tour_id) {
        whereConditions.push('r.tour_id = ?');
        whereParams.push(parseInt(tour_id));
      }

      if (rating) {
        whereConditions.push('r.rating = ?');
        whereParams.push(parseInt(rating));
      }

      if (active_only === 'true') {
        whereConditions.push('r.is_active = true');
      }

      const whereClause = whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM reviews r
        LEFT JOIN tours t ON r.tour_id = t.id
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        ${whereClause}
      `;

      const [countResult] = await pool.execute(countQuery, whereParams);
      const totalReviews = countResult[0].total;

      // Main query with safe LIMIT/OFFSET concatenation
      const reviewsQuery = `
        SELECT
          r.*,
          tc.title as tour_title,
          c.name as city_name
        FROM reviews r
        LEFT JOIN tours t ON r.tour_id = t.id
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        LEFT JOIN cities c ON t.city_id = c.id
        ${whereClause}
        ORDER BY r.review_date DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      const [reviews] = await pool.execute(reviewsQuery, whereParams);

      res.json({
        success: true,
        data: {
          reviews,
          pagination: {
            currentPage: safePage,
            totalPages: Math.ceil(totalReviews / safeLimit),
            totalItems: totalReviews,
            itemsPerPage: safeLimit
          }
        }
      });
    } catch (error) {
      console.error('❌ Get all reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  // Get review by ID
  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const [reviewRows] = await pool.execute(`
        SELECT 
          r.*,
          tc.title as tour_title,
          c.name as city_name
        FROM reviews r
        LEFT JOIN tours t ON r.tour_id = t.id
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        LEFT JOIN cities c ON t.city_id = c.id
        WHERE r.id = ?
      `, [id]);

      if (reviewRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        data: reviewRows[0]
      });
    } catch (error) {
      console.error('Get review by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create review
  async createReview(req, res) {
    try {
      const { tour_id, client_name, rating, comment, review_date } = req.body;

      // Check if tour exists
      const [tourRows] = await pool.execute(
        'SELECT id FROM tours WHERE id = ?',
        [tour_id]
      );

      if (tourRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      // Get tour name for the review
      const [tourContent] = await pool.execute(
        'SELECT title FROM tour_content WHERE tour_id = ? AND language_code = "en"',
        [tour_id]
      );

      const tour_name = tourContent.length > 0 ? tourContent[0].title : 'Unknown Tour';

      // Handle file uploads
      const client_image = req.files?.client_image?.[0]?.filename || null;
      const profile_image = req.files?.profile_image?.[0]?.filename || null;

      // Use current date if review_date not provided
      const finalReviewDate = review_date || new Date().toISOString().split('T')[0];

      const [result] = await pool.execute(`
        INSERT INTO reviews (tour_id, client_name, rating, comment, tour_name, review_date, client_image, profile_image, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)
      `, [tour_id, client_name, rating || null, comment, tour_name, finalReviewDate, client_image, profile_image]);

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('❌ Create review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update review
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { client_name, rating, comment, review_date, is_active } = req.body;

      const [existingReview] = await pool.execute(
        'SELECT * FROM reviews WHERE id = ?',
        [id]
      );

      if (existingReview.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (client_name !== undefined) {
        updateFields.push('client_name = ?');
        updateValues.push(client_name);
      }

      if (rating !== undefined) {
        updateFields.push('rating = ?');
        updateValues.push(rating);
      }

      if (comment !== undefined) {
        updateFields.push('comment = ?');
        updateValues.push(comment);
      }

      if (review_date !== undefined) {
        updateFields.push('review_date = ?');
        updateValues.push(review_date);
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
        `UPDATE reviews SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Review updated successfully'
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete review
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Toggle review status
  async toggleReviewStatus(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute(
        'UPDATE reviews SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review status updated successfully'
      });
    } catch (error) {
      console.error('Toggle review status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get promotional reviews for homepage (specific language)
  async getPromotionalReviews(req, res) {
    try {
      const { limit = 6, language = 'en' } = req.query;
      const safeLimit = Math.max(1, Math.min(20, parseInt(limit)));

      const query = `
        SELECT 
          pr.id,
          pr.client_name,
          pr.screenshot_image,
          pr.review_date,
          pr.display_order,
          prt.review_text
        FROM promotional_reviews pr
        INNER JOIN promotional_review_translations prt ON pr.id = prt.review_id
        WHERE pr.is_active = true AND prt.language_code = ?
        ORDER BY pr.display_order ASC, pr.created_at DESC 
        LIMIT ${safeLimit}
      `;

      const [reviews] = await pool.execute(query, [language]);

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('❌ Get promotional reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all promotional reviews for admin (ADMIN ONLY)
  async getAllPromotionalReviews(req, res) {
    try {
      const { page = 1, limit = 10, language_code } = req.query;
      const safeLimit = Math.max(1, Math.min(100, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      if (language_code) {
        // Get reviews for specific language
        const query = `
          SELECT 
            pr.id,
            pr.client_name,
            pr.screenshot_image,
            pr.review_date,
            pr.is_active,
            pr.display_order,
            pr.created_at,
            pr.updated_at,
            prt.review_text
          FROM promotional_reviews pr
          INNER JOIN promotional_review_translations prt ON pr.id = prt.review_id
          WHERE prt.language_code = ?
          ORDER BY pr.display_order ASC, pr.created_at DESC 
          LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;

        const [reviews] = await pool.execute(query, [language_code]);

        res.json({
          success: true,
          data: reviews
        });
      } else {
        // Get all reviews with all translations (multi-query approach)
        const mainQuery = `
          SELECT 
            pr.id,
            pr.client_name,
            pr.screenshot_image,
            pr.review_date,
            pr.is_active,
            pr.display_order,
            pr.created_at,
            pr.updated_at
          FROM promotional_reviews pr
          ORDER BY pr.display_order ASC, pr.created_at DESC 
          LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;

        const [mainReviews] = await pool.execute(mainQuery);

        // Get translations for each review
        const reviewsWithTranslations = [];
        for (const review of mainReviews) {
          const [translations] = await pool.execute(
            'SELECT language_code, review_text FROM promotional_review_translations WHERE review_id = ?',
            [review.id]
          );

          const translationsObj = {};
          translations.forEach(trans => {
            translationsObj[trans.language_code] = trans.review_text;
          });

          reviewsWithTranslations.push({
            ...review,
            translations: translationsObj
          });
        }

        // Get total count
        const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM promotional_reviews');
        const totalReviews = countResult[0].total;

        res.json({
          success: true,
          data: {
            reviews: reviewsWithTranslations,
            pagination: {
              currentPage: safePage,
              totalPages: Math.ceil(totalReviews / safeLimit),
              totalItems: totalReviews,
              itemsPerPage: safeLimit
            }
          }
        });
      }
    } catch (error) {
      console.error('❌ Get all promotional reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  // Create promotional review with translations
  async createPromotionalReview(req, res) {
    try {
      const { client_name, translations, review_date, display_order = 0 } = req.body;

      if (!client_name || !translations || !review_date) {
        return res.status(400).json({
          success: false,
          message: 'Client name, translations, and review date are required'
        });
      }

      // Handle screenshot image upload
      const screenshot_image = req.files?.screenshot_image?.[0]?.filename || null;

      // Use connection instead of pool for transactions
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();

        // Insert main promotional review
        const [reviewResult] = await connection.execute(`
          INSERT INTO promotional_reviews (client_name, screenshot_image, review_date, display_order)
          VALUES (?, ?, ?, ?)
        `, [client_name, screenshot_image, review_date, display_order]);

        const reviewId = reviewResult.insertId;

        // Insert translations
        for (const [langCode, reviewText] of Object.entries(translations)) {
          if (reviewText && reviewText.trim()) {
            await connection.execute(
              'INSERT INTO promotional_review_translations (review_id, language_code, review_text) VALUES (?, ?, ?)',
              [reviewId, langCode, reviewText.trim()]
            );
          }
        }

        await connection.commit();

        res.json({
          success: true,
          message: 'Promotional review created successfully',
          data: { id: reviewId }
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('❌ Create promotional review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update promotional review
  async updatePromotionalReview(req, res) {
    try {
      const { id } = req.params;
      const { client_name, translations, review_date, display_order, is_active } = req.body;

      await pool.execute('START TRANSACTION');

      try {
        // Handle screenshot image upload
        const screenshot_image = req.files?.screenshot_image?.[0]?.filename;

        // Update main review
        let updateFields = [];
        let updateValues = [];

        if (client_name !== undefined) {
          updateFields.push('client_name = ?');
          updateValues.push(client_name);
        }

        if (screenshot_image) {
          updateFields.push('screenshot_image = ?');
          updateValues.push(screenshot_image);
        }

        if (review_date !== undefined) {
          updateFields.push('review_date = ?');
          updateValues.push(review_date);
        }

        if (display_order !== undefined) {
          updateFields.push('display_order = ?');
          updateValues.push(display_order);
        }

        if (is_active !== undefined) {
          updateFields.push('is_active = ?');
          updateValues.push(is_active);
        }

        if (updateFields.length > 0) {
          updateFields.push('updated_at = CURRENT_TIMESTAMP');
          updateValues.push(id);

          await pool.execute(
            `UPDATE promotional_reviews SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );
        }

        // Update translations if provided
        if (translations) {
          for (const [langCode, reviewText] of Object.entries(translations)) {
            if (reviewText !== undefined) {
              await pool.execute(`
                INSERT INTO promotional_review_translations (review_id, language_code, review_text)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE review_text = VALUES(review_text)
              `, [id, langCode, reviewText]);
            }
          }
        }

        await pool.execute('COMMIT');

        res.json({
          success: true,
          message: 'Promotional review updated successfully'
        });
      } catch (error) {
        await pool.execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Update promotional review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ContentController();