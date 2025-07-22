const { pool } = require('../config/database');
const currencyService = require('../services/currencyService');

class PublicController {
  // Get homepage data with RANDOM selections as requested
  async getHomepageData(req, res) {
    try {
      const { language = 'en' } = req.query;
      
      // Base URL for images
      const baseImageUrl = `${process.env.API_BASE_URL || 'http://localhost:5000'}/uploads/`;

      // Get featured tours with PROPER TRANSLATIONS
      const [featuredTours] = await pool.execute(`
        SELECT 
          t.*,
          COALESCE(tc.title, 'Tour Title Not Available') as title,
          COALESCE(tc.category, cat.name) as category,
          COALESCE(tc.duration, 'Duration TBA') as duration,
          COALESCE(tc.availability, 'Daily') as availability,
          COALESCE(ct_city.name, c.name) as city_name,
          COALESCE(cat_trans.name, cat.name) as category_type,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        WHERE t.status = 'active' AND t.featured_tag IS NOT NULL
        ORDER BY RAND()
        LIMIT 6
      `, [language, language, language]);

      // Process featured tours with full image URLs
      const processedFeaturedTours = featuredTours.map(tour => ({
        ...tour,
        cover_image_url: tour.cover_image ? `${baseImageUrl}${tour.cover_image}` : null,
        days_of_week: tour.availability || 'Daily'
      }));

      // Get 3 cities RANDOMLY for explore section WITH TRANSLATIONS
      const [exploreCities] = await pool.execute(`
        SELECT 
          c.*,
          COALESCE(ct.name, c.name) as name,
          COALESCE(ct.description, c.description) as description,
          COUNT(t.id) as tours_count,
          MIN(t.price_adult) as min_price
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        WHERE c.is_active = true
        GROUP BY c.id, COALESCE(ct.name, c.name), COALESCE(ct.description, c.description), c.image
        HAVING tours_count > 0
        ORDER BY RAND()
        LIMIT 3
      `, [language]);

      // Process explore cities with full image URLs
      const processedExploreCities = exploreCities.map(city => ({
        ...city,
        image_url: city.image ? `${baseImageUrl}${city.image}` : null
      }));

      // Get ALL cities for header with TRANSLATIONS
      const [allCitiesForHeader] = await pool.execute(`
        SELECT 
          c.id,
          COALESCE(ct.name, c.name) as name,
          c.image,
          COUNT(t.id) as tours_count
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        WHERE c.is_active = true
        GROUP BY c.id, COALESCE(ct.name, c.name), c.image
        HAVING tours_count > 0
        ORDER BY COALESCE(ct.name, c.name) ASC
      `, [language]);

      // Process header cities with full image URLs
      const processedHeaderCities = allCitiesForHeader.map(city => ({
        ...city,
        image_url: city.image ? `${baseImageUrl}${city.image}` : null
      }));

      // Get today's prices with TRANSLATED TOUR TITLES
      const [allCitiesWithPrices] = await pool.execute(`
        SELECT 
          c.id as city_id,
          COALESCE(ct.name, c.name) as city_name,
          COUNT(t.id) as total_tours,
          MIN(t.price_adult) as min_price,
          MAX(t.price_adult) as max_price,
          AVG(t.price_adult) as avg_price,
          GROUP_CONCAT(
            CONCAT(COALESCE(tc.title, 'Tour'), '|', t.price_adult, '|', t.price_child, '|', t.id)
            ORDER BY t.price_adult ASC
            SEPARATOR ';;'
          ) as tours_with_prices
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        WHERE c.is_active = true
        GROUP BY c.id, COALESCE(ct.name, c.name)
        HAVING total_tours > 0
        ORDER BY COALESCE(ct.name, c.name) ASC
      `, [language, language]);

      // Process tours with prices (same as before)
      const processedCitiesWithPrices = allCitiesWithPrices.map(city => {
        const tours = [];
        if (city.tours_with_prices) {
          const toursList = city.tours_with_prices.split(';;');
          toursList.forEach(tourStr => {
            const [title, priceAdult, priceChild, tourId] = tourStr.split('|');
            tours.push({
              id: parseInt(tourId),
              title,
              price_adult: parseFloat(priceAdult),
              price_child: parseFloat(priceChild)
            });
          });
        }
        
        return {
          city_id: city.city_id,
          city_name: city.city_name,
          total_tours: city.total_tours,
          min_price: parseFloat(city.min_price),
          max_price: parseFloat(city.max_price),
          avg_price: parseFloat(city.avg_price),
          tours
        };
      });

      // Get PROMOTIONAL REVIEWS (already correct)
      const [promotionalReviews] = await pool.execute(`
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
        LIMIT 6
      `, [language]);

      // Process promotional reviews with full image URLs
      const processedPromotionalReviews = promotionalReviews.map(review => ({
        ...review,
        screenshot_image_url: review.screenshot_image ? `${baseImageUrl}${review.screenshot_image}` : null
      }));

      res.json({
        success: true,
        data: {
          featuredTours: processedFeaturedTours,
          exploreCities: processedExploreCities,
          allCitiesForHeader: processedHeaderCities,
          todaysPrices: processedCitiesWithPrices,
          promotionalReviews: processedPromotionalReviews,
          serverDate: new Date().toISOString().split('T')[0]
        }
      });
    } catch (error) {
      console.error('Get homepage data error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get cities for header/navigation (multi-language with images)
  async getCitiesForHeader(req, res) {
    try {
      const { language = 'en' } = req.query;

      const [cities] = await pool.execute(`
        SELECT
          c.id,
          COALESCE(ct.name, c.name) as name,
          COALESCE(ct.description, c.description) as description,
          c.image,
          COUNT(t.id) as tours_count
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        WHERE c.is_active = true
        GROUP BY c.id, COALESCE(ct.name, c.name), COALESCE(ct.description, c.description), c.image
        HAVING tours_count > 0
        ORDER BY COALESCE(ct.name, c.name) ASC
      `, [language]);

      // Process cities to include full image URLs
      const processedCities = cities.map(city => ({
        ...city,
        image_url: city.image ? `${process.env.API_BASE_URL || 'http://localhost:5000'}/uploads/${city.image}` : null
      }));

      res.json({
        success: true,
        data: processedCities
      });
    } catch (error) {
      console.error('❌ Get cities for header error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

// Get city page data
async getCityPageData(req, res) {
  try {
    const { cityName } = req.params;
    const { language = 'en', page = 1, limit = 12, category_id, sort_by = 'created_at' } = req.query;

    // Get city info
    const [cityRows] = await pool.execute(
      'SELECT * FROM cities WHERE name = ? AND is_active = true',
      [cityName]
    );

    if (cityRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    const city = cityRows[0];
    
    // Safe pagination values
    const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
    const safePage = Math.max(1, parseInt(page));
    const safeOffset = (safePage - 1) * safeLimit;

    // Build WHERE conditions
    let whereConditions = ['t.city_id = ?', 't.status = "active"'];
    let whereParams = [city.id];

    if (category_id) {
      whereConditions.push('t.category_id = ?');
      whereParams.push(parseInt(category_id));
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Get total tours count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tours t
      ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, whereParams);
    const totalTours = countResult[0].total;

    // Safe sort validation
    const validSorts = ['created_at', 'price_adult', 'views', 'rating'];
    const safeSortBy = validSorts.includes(sort_by) ? sort_by : 'created_at';

    // Get tours with pagination (hybrid approach)
    const toursQuery = `
      SELECT 
        t.*,
        tc.title,
        tc.category,
        tc.duration,
        tc.description,
        cat.name as category_type,
        (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
        (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
      FROM tours t
      LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = '${language}'
      LEFT JOIN tour_categories cat ON t.category_id = cat.id
      ${whereClause}
      ORDER BY 
        CASE '${safeSortBy}'
          WHEN 'price_adult' THEN t.price_adult
          WHEN 'views' THEN t.views
          WHEN 'rating' THEN (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true)
          ELSE t.created_at
        END DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;

    const [tours] = await pool.execute(toursQuery, whereParams);

    // Get categories for this city
    const [categories] = await pool.execute(`
      SELECT DISTINCT
        cat.id,
        cat.name,
        COUNT(t.id) as tours_count
      FROM tour_categories cat
      INNER JOIN tours t ON cat.id = t.category_id
      WHERE t.city_id = ? AND t.status = 'active' AND cat.is_active = true
      GROUP BY cat.id, cat.name
      ORDER BY cat.name ASC
    `, [city.id]);

    res.json({
      success: true,
      data: {
        city,
        tours,
        categories,
        pagination: {
          currentPage: safePage,
          totalPages: Math.ceil(totalTours / safeLimit),
          totalItems: totalTours,
          itemsPerPage: safeLimit
        }
      }
    });
  } catch (error) {
    console.error('❌ Get city page data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

  // Get tour detail page data
  async getTourDetailData(req, res) {
    try {
      const { cityName, tourId } = req.params;
      const { language = 'en' } = req.query;

      // Get tour with city check
      const [tourRows] = await pool.execute(`
        SELECT
          t.*,
          c.name as city_name,
          cat.name as category_type
        FROM tours t
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        WHERE t.id = ? AND c.name = ? AND t.status = 'active'
      `, [tourId, cityName]);

      if (tourRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      const tour = tourRows[0];

      // Get tour content for the specified language
      const [contentRows] = await pool.execute(
        'SELECT * FROM tour_content WHERE tour_id = ? AND language_code = ?',
        [tourId, language]
      );

      // Get tour images
      const [imageRows] = await pool.execute(
        'SELECT * FROM tour_images WHERE tour_id = ? ORDER BY id',
        [tourId]
      );

      // Get reviews
      const [reviewRows] = await pool.execute(`
        SELECT * FROM reviews
        WHERE tour_id = ? AND is_active = true
        ORDER BY review_date DESC
        LIMIT 10
      `, [tourId]);

      // Process tour content with safe JSON parsing
      const parseJSONSafe = (jsonString) => {
        if (!jsonString) return [];
        if (Array.isArray(jsonString)) return jsonString;
        
        try {
          return JSON.parse(jsonString);
        } catch (error) {
          console.warn('🔴 Invalid JSON, trying alternative parsing:', jsonString);
          
          try {
            let fixedJson = jsonString
              .replace(/'/g, '"')
              .replace(/[\r\n\t]/g, '')
              .trim();
            return JSON.parse(fixedJson);
          } catch (error2) {
            // Manual extraction as last resort
            if (typeof jsonString === 'string' && jsonString.includes('"')) {
              const matches = jsonString.match(/"([^"]*)"/g);
              return matches ? matches.map(match => match.replace(/"/g, '')) : [jsonString];
            }
            return [jsonString.toString()];
          }
        }
      };

      const content = contentRows.length > 0 ? {
        title: contentRows[0].title,
        category: contentRows[0].category,
        duration: contentRows[0].duration,
        availability: contentRows[0].availability,
        description: contentRows[0].description,
        included: parseJSONSafe(contentRows[0].included),
        not_included: parseJSONSafe(contentRows[0].not_included),
        trip_program: parseJSONSafe(contentRows[0].trip_program),
        take_with_you: parseJSONSafe(contentRows[0].take_with_you)
      } : null;

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
      console.error('❌ Get tour detail data error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get FAQs for public (UPDATED for new structure)
  async getPublicFAQs(req, res) {
    try {
      const { language = 'en' } = req.query;

      const [faqs] = await pool.execute(`
        SELECT 
          f.id,
          f.display_order,
          ft.question,
          ft.answer
        FROM faqs f
        INNER JOIN faq_translations ft ON f.id = ft.faq_id
        WHERE f.is_active = true AND ft.language_code = ?
        ORDER BY f.display_order ASC, f.created_at ASC
      `, [language]);

      res.json({
        success: true,
        data: faqs
      });
    } catch (error) {
      console.error('❌ Get public FAQs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get public reviews
  async getPublicReviews(req, res) {
    try {
      const { limit = 6, tour_id } = req.query;
      
      const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));

      let whereConditions = ['r.is_active = true'];
      let whereParams = [];

      if (tour_id) {
        whereConditions.push('r.tour_id = ?');
        whereParams.push(parseInt(tour_id));
      }

      const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

      const query = `
        SELECT 
          r.client_name,
          r.rating,
          r.comment,
          r.review_date,
          tc.title as tour_title,
          c.name as city_name
        FROM reviews r
        LEFT JOIN tours t ON r.tour_id = t.id
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = 'en'
        LEFT JOIN cities c ON t.city_id = c.id
        ${whereClause}
        ORDER BY r.review_date DESC 
        LIMIT ${safeLimit}
      `;

      const [reviews] = await pool.execute(query, whereParams);

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('❌ Get public reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Search tours
  async searchTours(req, res) {
    try {
      const {
        q = '',
        language = 'en',
        city_id,
        category_id,
        min_price,
        max_price,
        page = 1,
        limit = 12
      } = req.query;

      // Safe values
      const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      let whereConditions = ['t.status = "active"'];
      let whereParams = [];

      if (q && q.trim()) {
        whereConditions.push('(tc.title LIKE ? OR tc.description LIKE ? OR c.name LIKE ?)');
        whereParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
      }

      if (city_id) {
        whereConditions.push('t.city_id = ?');
        whereParams.push(parseInt(city_id));
      }

      if (category_id) {
        whereConditions.push('t.category_id = ?');
        whereParams.push(parseInt(category_id));
      }

      if (min_price) {
        whereConditions.push('t.price_adult >= ?');
        whereParams.push(parseFloat(min_price));
      }

      if (max_price) {
        whereConditions.push('t.price_adult <= ?');
        whereParams.push(parseFloat(max_price));
      }

      const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT t.id) as total
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = '${language}'
        LEFT JOIN cities c ON t.city_id = c.id
        ${whereClause}
      `;

      const [countResult] = await pool.execute(countQuery, whereParams);
      const totalTours = countResult[0].total;

      // Get tours (hybrid approach)
      const toursQuery = `
        SELECT 
          t.*,
          tc.title,
          tc.category,
          tc.duration,
          tc.description,
          c.name as city_name,
          cat.name as category_type,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = '${language}'
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        ${whereClause}
        ORDER BY t.views DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      const [tours] = await pool.execute(toursQuery, whereParams);

      res.json({
        success: true,
        data: {
          tours,
          pagination: {
            currentPage: safePage,
            totalPages: Math.ceil(totalTours / safeLimit),
            totalItems: totalTours,
            itemsPerPage: safeLimit
          },
          searchQuery: q
        }
      });
    } catch (error) {
      console.error('❌ Search tours error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get currency conversion
  async getCurrencyConversion(req, res) {
    try {
      const { amount, from = 'USD', to } = req.query; // Changed parameter names

      if (!amount || !to) {
        return res.status(400).json({
          success: false,
          message: 'Amount and target currency are required'
        });
      }

      const result = await currencyService.convertWithCommission(
        parseFloat(amount),
        from,
        to
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Currency conversion failed'
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('❌ Get currency conversion error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

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

}

module.exports = new PublicController();