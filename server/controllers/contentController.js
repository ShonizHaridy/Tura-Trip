const { pool } = require('../config/database');
const imageHelper = require('../utils/imageHelper');

const notificationController = require('./notificationController');

class ContentController {
  // ==== FAQ MANAGEMENT ====

  // Get all FAQs with translations
  async getAllFAQs(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        language_code,
        active_only = false,
        search = '' // ✅ ADD search parameter
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

      // ✅ ADD search functionality
      if (search && search.trim()) {
        if (language_code) {
          // Search in specific language
          whereConditions.push('(ft.question LIKE ? OR ft.answer LIKE ?)');
          queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
        } else {
          // Search across all languages (for admin)
          whereConditions.push(`EXISTS (
            SELECT 1 FROM faq_translations ft_search 
            WHERE ft_search.faq_id = f.id 
            AND (ft_search.question LIKE ? OR ft_search.answer LIKE ?)
          )`);
          queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
        }
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
        // Get all FAQs with all translations for admin
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
        const countQuery = `SELECT COUNT(DISTINCT f.id) as total FROM faqs f ${whereClause}`;
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
      console.error('⌚ Get all FAQs error:', error);
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
    const connection = await pool.getConnection();
    try {
      const { translations, is_active = true, display_order = 0 } = req.body;

      if (!translations || Object.keys(translations).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'FAQ translations are required'
        });
      }

      await connection.beginTransaction();

      try {
        // Insert main FAQ
        const [faqResult] = await connection.execute(
          'INSERT INTO faqs (is_active, display_order) VALUES (?, ?)',
          [is_active, display_order]
        );

        const faqId = faqResult.insertId;

        // Insert translations
        for (const [langCode, translation] of Object.entries(translations)) {
          const { question, answer } = translation;
          if (question && answer) {
            await connection.execute(
              'INSERT INTO faq_translations (faq_id, language_code, question, answer) VALUES (?, ?, ?, ?)',
              [faqId, langCode, question, answer]
            );
          }
        }

        await connection.commit();

        res.json({
          success: true,
          message: 'FAQ created successfully',
          data: { id: faqId }
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Create FAQ error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
    }
  }

  // Update FAQ
  async updateFAQ(req, res) {
    const connection = await pool.getConnection();
    try {
      const { id } = req.params;
      const { translations, is_active, display_order } = req.body;

      // Check if FAQ exists
      const [existingFAQ] = await connection.execute(
        'SELECT * FROM faqs WHERE id = ?',
        [id]
      );

      if (existingFAQ.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      await connection.beginTransaction();

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

          await connection.execute(
            `UPDATE faqs SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );
        }

        // Update translations if provided
        if (translations) {
          for (const [langCode, translation] of Object.entries(translations)) {
            const { question, answer } = translation;
            if (question && answer) {
              await connection.execute(`
                INSERT INTO faq_translations (faq_id, language_code, question, answer)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                question = VALUES(question),
                answer = VALUES(answer)
              `, [id, langCode, question, answer]);
            }
          }
        }

        await connection.commit();

        res.json({
          success: true,
          message: 'FAQ updated successfully'
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Update FAQ error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } finally {
      connection.release();
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
      active_only = false,
      search = '' // ✅ ADD search parameter
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

    // ✅ ADD search functionality
    if (search && search.trim()) {
      whereConditions.push('(r.client_name LIKE ? OR r.comment LIKE ? OR tc.title LIKE ? OR c.name LIKE ?)');
      whereParams.push(
        `%${search.trim()}%`, 
        `%${search.trim()}%`, 
        `%${search.trim()}%`, 
        `%${search.trim()}%`
      );
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
      LEFT JOIN cities c ON t.city_id = c.id
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
      -- ORDER BY r.review_date DESC
      ORDER BY r.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;

    console.log('🔍 Reviews Query:', reviewsQuery);
    console.log('🔍 Reviews Params:', whereParams);

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
    console.error('⌚ Get all reviews error:', error);
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

      // await notificationController.createNotification(
      //   'review',
      //   'New Review Submitted',
      //   `A new review has been submitted for tour: ${tour_name}`,
      //   tour_id,
      //   'tour'
      // );
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

      // ✅ Get tour_id before deletion for notification cleanup
      const [reviewData] = await pool.execute(
        'SELECT tour_id FROM reviews WHERE id = ?', 
        [id]
      );

      const [result] = await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // ✅ Delete related notifications
      if (reviewData.length > 0) {
        await notificationController.deleteNotificationsByRelatedId(
          reviewData[0].tour_id, 
          'tour'
        );
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
      const processedReviews = imageHelper.processArrayImages(reviews, 'review');

      console.log("These are the reviews:", processedReviews);
      res.json({
        success: true,
        data: processedReviews
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
    const { 
      page = 1, 
      limit = 10, 
      language_code,
      search = '' // ✅ ADD search parameter
    } = req.query;
    
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit)));
    const safePage = Math.max(1, parseInt(page));
    const safeOffset = (safePage - 1) * safeLimit;

    let whereConditions = [];
    let whereParams = [];

    // ✅ ADD search functionality
    if (search && search.trim()) {
      if (language_code) {
        // Search in specific language
        whereConditions.push('(pr.client_name LIKE ? OR prt.review_text LIKE ?)');
        whereParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
      } else {
        // Search across all languages (for admin)
        whereConditions.push(`(pr.client_name LIKE ? OR EXISTS (
          SELECT 1 FROM promotional_review_translations prt_search 
          WHERE prt_search.review_id = pr.id 
          AND prt_search.review_text LIKE ?
        ))`);
        whereParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
      }
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

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
        ${whereClause}
        ${whereClause ? 'AND' : 'WHERE'} prt.language_code = ?
        ORDER BY pr.display_order ASC, pr.created_at DESC 
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      whereParams.push(language_code);
      console.log('🔍 Promotional Reviews Query (specific language):', query);
      console.log('🔍 Promotional Reviews Params:', whereParams);

      const [reviews] = await pool.execute(query, whereParams);
      const processedReviews = imageHelper.processArrayImages(reviews, 'review');

      res.json({
        success: true,
        data: processedReviews
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
        ${whereClause}
        ORDER BY pr.display_order ASC, pr.created_at DESC 
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      console.log('🔍 Promotional Reviews Main Query:', mainQuery);
      console.log('🔍 Promotional Reviews Main Params:', whereParams);

      const [mainReviews] = await pool.execute(mainQuery, whereParams);

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

      const processedReviewsWithTranslations = imageHelper.processArrayImages(reviewsWithTranslations, 'review');

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM promotional_reviews pr ${whereClause}`;
      const [countResult] = await pool.execute(countQuery, whereParams);
      const totalReviews = countResult[0].total;

      res.json({
        success: true,
        data: {
          reviews: processedReviewsWithTranslations,
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
    console.error('⌚ Get all promotional reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}


  // Create promotional review with translations
// Create promotional review with translations
async createPromotionalReview(req, res) {
  const connection = await pool.getConnection();
  try {
    let { client_name, translations, review_date, display_order = 0 } = req.body;

    // Parse translations if it's a string
    if (typeof translations === 'string') {
      try {
        translations = JSON.parse(translations);
      } catch (error) {
        console.error('❌ JSON parse error for translations:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid translations format'
        });
      }
    }

    if (!client_name || !translations || !review_date) {
      return res.status(400).json({
        success: false,
        message: 'Client name, translations, and review date are required'
      });
    }

    console.log('🔍 Creating review with translations:', translations);

    // Handle screenshot image upload
    const screenshot_image = req.files?.screenshot_image?.[0]?.filename || null;

    await connection.beginTransaction();

    // Insert main promotional review
    const [reviewResult] = await connection.execute(`
      INSERT INTO promotional_reviews (client_name, screenshot_image, review_date, display_order)
      VALUES (?, ?, ?, ?)
    `, [client_name, screenshot_image, review_date, display_order]);

    const reviewId = reviewResult.insertId;

    // Insert translations with validation
    const validLanguages = ['en', 'ru', 'it', 'de'];
    
    for (const [langCode, reviewText] of Object.entries(translations)) {
      // Clean and validate language code
      const cleanLangCode = String(langCode).trim().toLowerCase();
      
      console.log(`🔍 Processing language: "${langCode}" -> cleaned: "${cleanLangCode}"`);
      
      // Validate language code
      if (!validLanguages.includes(cleanLangCode)) {
        console.error(`❌ Invalid language code: "${cleanLangCode}"`);
        continue; // Skip invalid language codes
      }
      
      // Only insert if reviewText is provided and not empty
      if (reviewText && String(reviewText).trim()) {
        const cleanReviewText = String(reviewText).trim();
        
        console.log(`✅ Inserting: ${cleanLangCode} -> "${cleanReviewText}"`);
        
        await connection.execute(
          'INSERT INTO promotional_review_translations (review_id, language_code, review_text) VALUES (?, ?, ?)',
          [reviewId, cleanLangCode, cleanReviewText]
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
    console.error('❌ Create promotional review error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      sql: error.sql,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
}

  // Update promotional review
// Update promotional review
async updatePromotionalReview(req, res) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    let { client_name, translations, review_date, display_order, is_active } = req.body;

    // Parse translations if it's a string
    if (typeof translations === 'string') {
      try {
        translations = JSON.parse(translations);
      } catch (error) {
        console.error('❌ JSON parse error for translations:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid translations format'
        });
      }
    }

    console.log('🔍 Received translations:', translations);
    console.log('🔍 Translations type:', typeof translations);

    await connection.beginTransaction();

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

      await connection.execute(
        `UPDATE promotional_reviews SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update translations if provided
    if (translations && typeof translations === 'object') {
      // Valid language codes
      const validLanguages = ['en', 'ru', 'it', 'de'];
      
      for (const [langCode, reviewText] of Object.entries(translations)) {
        // Clean and validate language code
        const cleanLangCode = String(langCode).trim().toLowerCase();
        
        console.log(`🔍 Processing language: "${langCode}" -> cleaned: "${cleanLangCode}"`);
        console.log(`🔍 Review text: "${reviewText}"`);
        
        // Validate language code
        if (!validLanguages.includes(cleanLangCode)) {
          console.error(`❌ Invalid language code: "${cleanLangCode}"`);
          continue; // Skip invalid language codes
        }
        
        // Only update if reviewText is provided and not empty
        if (reviewText !== undefined && reviewText !== null && String(reviewText).trim() !== '') {
          const cleanReviewText = String(reviewText).trim();
          
          console.log(`✅ Inserting: ${cleanLangCode} -> "${cleanReviewText}"`);
          
          await connection.execute(`
            INSERT INTO promotional_review_translations (review_id, language_code, review_text)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE review_text = VALUES(review_text)
          `, [id, cleanLangCode, cleanReviewText]);
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Promotional review updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Update promotional review error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      sql: error.sql,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
}

  // Delete promotional review
  async deletePromotionalReview(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute('DELETE FROM promotional_reviews WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Promotional review not found'
        });
      }

      res.json({
        success: true,
        message: 'Promotional review deleted successfully'
      });
    } catch (error) {
      console.error('❌ Delete promotional review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


}

module.exports = new ContentController();