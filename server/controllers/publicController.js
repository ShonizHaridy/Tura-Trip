const { pool } = require('../config/database');
const currencyService = require('../services/currencyService');
const imageHelper = require('../utils/imageHelper');
const SlugHelper = require('../utils/slugHelper');

const emailService = require('../services/emailService');
const countryService = require('../services/countryService');


class PublicController {
  // Get homepage data with RANDOM selections as requested
  async getHomepageData(req, res) {
    try {
      const { language = 'en' } = req.query;

      // Get featured tours with proper translations
      const [featuredTours] = await pool.execute(`
        SELECT
          t.*,
          COALESCE(tc.title, 'Tour Title Not Available') as title,
          COALESCE(tc.category, cat.name) as category,
          COALESCE(tc.duration, 'Duration TBA') as duration,
          COALESCE(tc.availability, 'Daily') as availability,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
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
        ORDER BY 
          CASE WHEN t.featured_tag IS NOT NULL THEN 0 ELSE 1 END,
          t.views DESC,
          t.created_at DESC
        LIMIT 6
      `, [language, language, language]);

      // Check if there are more than 6 featured tours available for view more button
      const [featuredCount] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM tours t
        WHERE t.status = 'active' AND t.featured_tag IS NOT NULL
      `);

      // Process featured tours with images
      const processedFeaturedTours = imageHelper.processArrayImages(featuredTours, 'tour').map(tour => ({
        ...tour,
        city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name) // ADD THIS
      }));

      // Get 3 cities RANDOMLY for explore section WITH TRANSLATIONS and tagline
      const [exploreCities] = await pool.execute(`
        SELECT
          c.*,
          c.name as original_name,  -- Add original English name
          COALESCE(ct.name, c.name) as name,
          COALESCE(ct.tagline, c.tagline) as tagline,
          COALESCE(ct.description, c.description) as description,
          COUNT(t.id) as tours_count,
          MIN(t.price_adult) as min_price
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        WHERE c.is_active = true
        GROUP BY c.id, COALESCE(ct.name, c.name), COALESCE(ct.tagline, c.tagline), COALESCE(ct.description, c.description), c.image
        HAVING tours_count > 0
        ORDER BY RAND()
        LIMIT 3
      `, [language]);

      // Process explore cities with images
      const processedExploreCities = imageHelper.processArrayImages(exploreCities, 'city').map(city => ({
        ...city,
        slug: SlugHelper.generateCitySlug(city.id, city.original_name), // Use original_name
        city_slug: SlugHelper.generateSlug(city.original_name)
      }));

      // Get ALL cities for header with TRANSLATIONS
      const [allCitiesForHeader] = await pool.execute(`
        SELECT
          c.id,
          c.name as original_name,  -- Add this
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

      // Process header cities with images
      const processedHeaderCities = imageHelper.processArrayImages(allCitiesForHeader, 'city').map(city => ({
        ...city,
        slug: SlugHelper.generateCitySlug(city.id, city.original_name), // Use original_name
        city_slug: SlugHelper.generateSlug(city.original_name)
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

      // Process tours with prices
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

      // Get PROMOTIONAL REVIEWS
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

      // Process promotional reviews with images
      const processedPromotionalReviews = imageHelper.processArrayImages(promotionalReviews, 'review');

      res.json({
        success: true,
        data: {
          featuredTours: processedFeaturedTours,
          exploreCities: processedExploreCities,
          allCitiesForHeader: processedHeaderCities,
          todaysPrices: processedCitiesWithPrices,
          promotionalReviews: processedPromotionalReviews,
          hasMoreFeatured: featuredCount[0].total > 6, // For view more button logic
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
          c.name as original_name,
          COALESCE(ct.name, c.name) as name,
          COALESCE(ct.tagline, c.tagline) as description,
          c.image,
          COUNT(t.id) as tours_count
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        WHERE c.is_active = true
        GROUP BY c.id, c.name, COALESCE(ct.name, c.name), COALESCE(ct.tagline, c.tagline), c.image
        HAVING tours_count > 0
        ORDER BY COALESCE(ct.name, c.name) ASC
      `, [language]);

      // Add slugs to cities
      const processedCities = imageHelper.processArrayImages(cities, 'city').map(city => ({
        ...city,
        slug: SlugHelper.generateCitySlug(city.id, city.original_name),
        city_slug: SlugHelper.generateSlug(city.original_name) // Use original_name here too
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

  // Get more featured tours for homepage view more
  async getMoreFeaturedTours(req, res) {
    try {
      const { language = 'en', offset = 0, limit = 6 } = req.query;
      const safeOffset = parseInt(offset) || 0;
      const safeLimit = Math.min(parseInt(limit) || 6, 6); // Max 6 per request

      // First try to get more featured tours
      const [featuredTours] = await pool.execute(`
        SELECT
          t.*,
          COALESCE(tc.title, 'Tour Title Not Available') as title,
          COALESCE(tc.category, cat.name) as category,  
          COALESCE(tc.duration, 'Duration TBA') as duration,
          COALESCE(tc.availability, 'Daily') as availability,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
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
        ORDER BY t.created_at DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `, [language, language, language]);

      let tours = [...featuredTours];

      // If we don't have enough featured tours, fill with regular active tours
      if (tours.length < safeLimit) {
        const remaining = safeLimit - tours.length;
        const featuredIds = tours.map(t => t.id);
        
        const [regularTours] = await pool.execute(`
          SELECT
            t.*,
            COALESCE(tc.title, 'Tour Title Not Available') as title,
            COALESCE(tc.category, cat.name) as category,
            COALESCE(tc.duration, 'Duration TBA') as duration,
            COALESCE(tc.availability, 'Daily') as availability,
            COALESCE(ct_city.name, c.name) as city_name,
            c.name as original_city_name,
            COALESCE(cat_trans.name, cat.name) as category_type,
            (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
            (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
          FROM tours t
          LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
          LEFT JOIN cities c ON t.city_id = c.id
          LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
          LEFT JOIN tour_categories cat ON t.category_id = cat.id
          LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
          WHERE t.status = 'active' ${featuredIds.length > 0 ? 'AND t.id NOT IN (' + featuredIds.join(',') + ')' : ''}
          ORDER BY t.created_at DESC
          LIMIT ${remaining}
        `, [language, language, language]);

        tours = [...tours, ...regularTours];
      }

      // Get total count to determine if there are more tours
      const [totalCount] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM tours t
        WHERE t.status = 'active'
      `);

      // Add city_slug to each tour
      const processedTours = imageHelper.processArrayImages(tours, 'tour').map(tour => ({
        ...tour,
        city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name)
      }));
      
      res.json({
        success: true,
        data: {
          tours: processedTours,
          hasMore: (safeOffset + tours.length) < totalCount[0].total,
          totalAvailable: totalCount[0].total
        }
      });
    } catch (error) {
      console.error('Get more featured tours error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get city page data with enhanced functionality
  async getCityPageData(req, res) {
    try {
      const { cityId } = req.params; // Now using cityId directly
      const { language = 'en', page = 1, limit = 6, category_id, sort_by = 'created_at' } = req.query;

      // Direct query using cityId - no slug parsing needed
      const [cityRows] = await pool.execute(`
        SELECT 
          c.*,
          c.name as original_name,  -- Keep original name for slug generation
          COALESCE(ct.name, c.name) as name,
          COALESCE(ct.tagline, c.tagline) as tagline,
          COALESCE(ct.description, c.description) as description
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        WHERE c.id = ? AND c.is_active = true
      `, [language, cityId]);

      if (cityRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }
      
      const city = imageHelper.processImages(cityRows[0], 'city');
      
      // Add proper slug to city object
      city.city_slug = SlugHelper.generateCitySlug(city.id, city.original_name);

      // Safe pagination values
      const safeLimit = Math.max(1, Math.min(6, parseInt(limit))); // Max 6 per page
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

      // Get tours with pagination and include city_slug
      const toursQuery = `
        SELECT
          t.*,
          tc.title,
          tc.category,
          tc.duration,
          tc.description,
          tc.availability,
          cat.name as category_type,
          COALESCE(cat_trans.name, cat.name) as localized_category_type,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
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

      const [tours] = await pool.execute(toursQuery, [language, language, language, ...whereParams]);
      
      // Add city_slug to each tour
      const processedTours = imageHelper.processArrayImages(tours, 'tour').map(tour => ({
        ...tour,
        city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name)
      }));

      // Get categories for this city
      const [categories] = await pool.execute(`
        SELECT DISTINCT
          cat.id,
          COALESCE(cat_trans.name, cat.name) as name,
          COUNT(t.id) as tours_count
        FROM tour_categories cat
        INNER JOIN tours t ON cat.id = t.category_id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        WHERE t.city_id = ? AND t.status = 'active' AND cat.is_active = true
        GROUP BY cat.id, COALESCE(cat_trans.name, cat.name)
        ORDER BY COALESCE(cat_trans.name, cat.name) ASC
      `, [language, city.id]);

      // Get today's prices for this city
      const [pricesData] = await pool.execute(`
        SELECT
          COUNT(t.id) as total_tours,
          MIN(t.price_adult) as min_price,
          MAX(t.price_adult) as max_price,
          AVG(t.price_adult) as avg_price,
          GROUP_CONCAT(
            CONCAT(COALESCE(tc.title, 'Tour'), '|', t.price_adult, '|', t.price_child, '|', t.id)
            ORDER BY t.price_adult ASC
            SEPARATOR ';;'
          ) as tours_with_prices
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        WHERE t.city_id = ? AND t.status = 'active'
      `, [language, city.id]);

      const todaysPrices = pricesData[0] || { total_tours: 0, tours_with_prices: null };
      const pricesTours = [];

      if (todaysPrices.tours_with_prices) {
        const toursList = todaysPrices.tours_with_prices.split(';;');
        toursList.forEach(tourStr => {
          const [title, priceAdult, priceChild, tourId] = tourStr.split('|');
          pricesTours.push({
            id: parseInt(tourId),
            title,
            price_adult: parseFloat(priceAdult),
            price_child: parseFloat(priceChild)
          });
        });
      }

      res.json({
        success: true,
        data: {
          city,
          tours: processedTours,
          categories,
          pagination: {
            currentPage: safePage,
            totalPages: Math.ceil(totalTours / safeLimit),
            totalItems: totalTours,
            itemsPerPage: safeLimit,
            hasMore: (safeOffset + processedTours.length) < totalTours
          },
          todaysPrices: {
            total_tours: todaysPrices.total_tours,
            min_price: todaysPrices.min_price ? parseFloat(todaysPrices.min_price) : 0,
            max_price: todaysPrices.max_price ? parseFloat(todaysPrices.max_price) : 0,
            avg_price: todaysPrices.avg_price ? parseFloat(todaysPrices.avg_price) : 0,
            tours: pricesTours,
            serverDate: new Date().toISOString().split('T')[0]
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

  // Get tour detail page data with breadcrumb and more like this
  async getTourDetailData(req, res) {
    try {
      const { cityId, tourId } = req.params; // Now using cityId directly
      const { language = 'en' } = req.query;

      // Direct query using cityId - no slug parsing needed
      const [tourRows] = await pool.execute(`
        SELECT
          t.*,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
          COALESCE(cat_trans.name, cat.name) as category_type,
          cat.id as category_id,
          c.id as city_id
        FROM tours t
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        WHERE t.id = ? AND c.id = ? AND t.status = 'active'
      `, [language, language, tourId, cityId]);

      if (tourRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      const tour = imageHelper.processArrayImages(tourRows, 'tour')[0];
      
      // Add proper slug to tour object
      tour.city_slug = SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name);

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

      // Process image URLs for gallery
      const processedImages = imageRows.map(img => ({
        ...img,
        image_url: imageHelper.getImageUrl(img.image_url)
      }));

      // Get reviews
      const [reviewRows] = await pool.execute(`
        SELECT * FROM reviews
        WHERE tour_id = ? AND is_active = true
        ORDER BY review_date DESC
        LIMIT 10
      `, [tourId]);

      const processedReviews = imageHelper.processArrayImages(reviewRows, 'review');

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

      // Get "More Like This" trips with city_slug
      const [moreLikeThis] = await pool.execute(`
        SELECT
          t.*,
          tc.title,
          tc.category,
          tc.duration,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
          COALESCE(cat_trans.name, cat.name) as category_type,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        WHERE t.id != ? AND t.status = 'active' 
        AND (t.category_id = ? OR t.city_id = ?)
        ORDER BY 
          CASE WHEN t.category_id = ? THEN 0 ELSE 1 END,
          RAND()
        LIMIT 4
      `, [language, language, language, tourId, tour.category_id, tour.city_id, tour.category_id]);

      // Add city_slug to each "more like this" tour
      const processedMoreLikeThis = imageHelper.processArrayImages(moreLikeThis, 'tour').map(tour => ({
        ...tour,
        city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name)
      }));

      // Calculate average rating
      const avgRating = reviewRows.length > 0
        ? reviewRows.reduce((sum, review) => sum + review.rating, 0) / reviewRows.length
        : 0;

      res.json({
        success: true,
        data: {
          tour,
          content,
          images: processedImages,
          reviews: processedReviews,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewsCount: reviewRows.length,
          moreLikeThis: processedMoreLikeThis
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

  // Get all tours from same category/city for "More Like This" view all
  async getMoreLikeThisAll(req, res) {
    try {
      const { tourId } = req.params;
      const { language = 'en', page = 1, limit = 12 } = req.query;

      // Get original tour info
      const [originalTour] = await pool.execute(`
        SELECT city_id, category_id FROM tours WHERE id = ?
      `, [tourId]);

      if (originalTour.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Original tour not found'
        });
      }

      const { city_id, category_id } = originalTour[0];

      const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      // Get similar tours with city_slug
      const [similarTours] = await pool.execute(`
        SELECT
          t.*,
          tc.title,
          tc.category,
          tc.duration,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
          COALESCE(cat_trans.name, cat.name) as category_type,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        WHERE t.id != ? AND t.status = 'active' 
        AND (t.category_id = ? OR t.city_id = ?)
        ORDER BY 
          CASE WHEN t.category_id = ? THEN 0 ELSE 1 END,
          t.created_at DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `, [language, language, language, tourId, category_id, city_id, category_id]);

      // Get total count
      const [countResult] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM tours t
        WHERE t.id != ? AND t.status = 'active' 
        AND (t.category_id = ? OR t.city_id = ?)
      `, [tourId, category_id, city_id]);

      const totalTours = countResult[0].total;
      
      // Add city_slug to each tour
      const processedTours = imageHelper.processArrayImages(similarTours, 'tour').map(tour => ({
        ...tour,
        city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name)
      }));

      res.json({
        success: true,
        data: {
          tours: processedTours,
          pagination: {
            currentPage: safePage,
            totalPages: Math.ceil(totalTours / safeLimit),
            totalItems: totalTours,
            itemsPerPage: safeLimit
          }
        }
      });
    } catch (error) {
      console.error('❌ Get more like this all error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  async getBrowseToursData(req, res) {
    try {
      const { language = 'en', limit = 50 } = req.query;
      const safeLimit = Math.min(parseInt(limit), 100); // Max 100 for performance

      // Get all active cities with their tours
      const [citiesWithTours] = await pool.execute(`
        SELECT
          c.id as city_id,
          c.name as original_name,
          COALESCE(ct.name, c.name) as city_name,
          COALESCE(ct.tagline, c.tagline) as city_tagline,
          COALESCE(ct.description, c.description) as city_description,
          c.image as city_image,
          COUNT(DISTINCT t.id) as total_tours,
          MIN(t.price_adult) as min_price,
          MAX(t.price_adult) as max_price,
          AVG(t.price_adult) as avg_price,
          GROUP_CONCAT(
            DISTINCT CONCAT(
              t.id, '|',
              COALESCE(tc.title, 'Tour'), '|',
              t.price_adult, '|',
              t.price_child, '|',
              t.cover_image, '|',
              COALESCE(tc.duration, 'Full Day'), '|',
              COALESCE(tc.category, cat.name), '|',
              t.featured_tag, '|',
              t.discount_percentage, '|',
              (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true)
            )
            ORDER BY 
              CASE WHEN t.featured_tag IS NOT NULL THEN 0 ELSE 1 END,
              t.views DESC
            SEPARATOR ';;'
          ) as tours_data
        FROM cities c
        LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
        LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        WHERE c.is_active = true
        GROUP BY c.id, c.name, COALESCE(ct.name, c.name), COALESCE(ct.tagline, c.tagline), COALESCE(ct.description, c.description), c.image
        HAVING total_tours > 0
        ORDER BY total_tours DESC, COALESCE(ct.name, c.name) ASC
      `, [language, language]);

      // Process the data
      const processedCities = citiesWithTours.map(city => {
        const tours = [];
        
        if (city.tours_data) {
          const toursArray = city.tours_data.split(';;');
          toursArray.forEach(tourStr => {
            const [
              id, title, price_adult, price_child, cover_image, 
              duration, category, featured_tag, discount_percentage, reviews_count
            ] = tourStr.split('|');
            
            tours.push({
              id: parseInt(id),
              title,
              price_adult: parseFloat(price_adult),
              price_child: parseFloat(price_child),
              cover_image,
              duration,
              category,
              featured_tag: featured_tag !== 'null' ? featured_tag : null,
              discount_percentage: parseFloat(discount_percentage) || 0,
              reviews_count: parseInt(reviews_count) || 0,
              city_id: city.city_id,
              city_name: city.city_name
            });
          });
        }

        console.log('Tours for city:', city.city_name, 'Count:', tours.length);

        return {
          city_id: city.city_id,
          original_name: city.original_name,
          city_name: city.city_name,
          city_tagline: city.city_tagline,
          city_description: city.city_description,
          city_image: city.city_image,
          total_tours: city.total_tours,
          min_price: parseFloat(city.min_price),
          max_price: parseFloat(city.max_price),
          avg_price: parseFloat(city.avg_price),
          tours: tours.slice(0, 6), // Show max 6 tours per city initially
          all_tours_count: tours.length,
          slug: SlugHelper.generateCitySlug(city.city_id, city.original_name)
        };
      });

      // Process images
      const citiesWithImages = imageHelper.processArrayImages(processedCities, 'city');
      
      // Process tour images
      citiesWithImages.forEach(city => {
        city.tours = imageHelper.processArrayImages(city.tours, 'tour');
      });

      // Get some statistics
      const totalCities = citiesWithImages.length;
      const totalTours = citiesWithImages.reduce((sum, city) => sum + city.total_tours, 0);
      const overallMinPrice = Math.min(...citiesWithImages.map(city => city.min_price));
      const overallMaxPrice = Math.max(...citiesWithImages.map(city => city.max_price));

      res.json({
        success: true,
        data: {
          cities: citiesWithImages,
          statistics: {
            total_cities: totalCities,
            total_tours: totalTours,
            price_range: {
              min: overallMinPrice,
              max: overallMaxPrice
            }
          }
        }
      });

    } catch (error) {
      console.error('❌ Get browse tours data error:', error);
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
  // async searchTours(req, res) {
  //   try {
  //     const {
  //       q = '',
  //       language = 'en',
  //       city_id,
  //       category_id,
  //       min_price,
  //       max_price,
  //       page = 1,
  //       limit = 12
  //     } = req.query;

  //     // Safe values
  //     const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
  //     const safePage = Math.max(1, parseInt(page));
  //     const safeOffset = (safePage - 1) * safeLimit;

  //     let whereConditions = ['t.status = "active"'];
  //     let whereParams = [];

  //     if (q && q.trim()) {
  //       whereConditions.push('(tc.title LIKE ? OR tc.description LIKE ? OR c.name LIKE ?)');
  //       whereParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
  //     }

  //     if (city_id) {
  //       whereConditions.push('t.city_id = ?');
  //       whereParams.push(parseInt(city_id));
  //     }

  //     if (category_id) {
  //       whereConditions.push('t.category_id = ?');
  //       whereParams.push(parseInt(category_id));
  //     }

  //     if (min_price) {
  //       whereConditions.push('t.price_adult >= ?');
  //       whereParams.push(parseFloat(min_price));
  //     }

  //     if (max_price) {
  //       whereConditions.push('t.price_adult <= ?');
  //       whereParams.push(parseFloat(max_price));
  //     }

  //     const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  //     // Get total count
  //     const countQuery = `
  //       SELECT COUNT(DISTINCT t.id) as total
  //       FROM tours t
  //       LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = '${language}'
  //       LEFT JOIN cities c ON t.city_id = c.id
  //       ${whereClause}
  //     `;

  //     const [countResult] = await pool.execute(countQuery, whereParams);
  //     const totalTours = countResult[0].total;

  //     // Get tours (hybrid approach)
  //     const toursQuery = `
  //       SELECT 
  //         t.*,
  //         tc.title,
  //         tc.category,
  //         tc.duration,
  //         tc.description,
  //         c.name as city_name,
  //         cat.name as category_type,
  //         (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
  //         (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
  //       FROM tours t
  //       LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = '${language}'
  //       LEFT JOIN cities c ON t.city_id = c.id
  //       LEFT JOIN tour_categories cat ON t.category_id = cat.id
  //       ${whereClause}
  //       ORDER BY t.views DESC
  //       LIMIT ${safeLimit} OFFSET ${safeOffset}
  //     `;

  //     const [tours] = await pool.execute(toursQuery, whereParams);
  //     const processedTours = imageHelper.processArrayImages(tours, 'tour');

  //     res.json({
  //       success: true,
  //       data: {
  //         tours: processedTours,
  //         pagination: {
  //           currentPage: safePage,
  //           totalPages: Math.ceil(totalTours / safeLimit),
  //           totalItems: totalTours,
  //           itemsPerPage: safeLimit
  //         },
  //         searchQuery: q
  //       }
  //     });
  //   } catch (error) {
  //     console.error('❌ Search tours error:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Internal server error'
  //     });
  //   }
  // }

  // Enhanced search tours - UPDATE THE EXISTING METHOD
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

      const safeLimit = Math.max(1, Math.min(50, parseInt(limit)));
      const safePage = Math.max(1, parseInt(page));
      const safeOffset = (safePage - 1) * safeLimit;

      let whereConditions = ['t.status = "active"'];
      let whereParams = [language, language, language]; // for the JOINs

      // ENHANCED SEARCH: Include category names in search
      if (q && q.trim()) {
        whereConditions.push(`(
          tc.title LIKE ? OR 
          tc.description LIKE ? OR 
          COALESCE(ct_city.name, c.name) LIKE ? OR
          COALESCE(cat_trans.name, cat.name) LIKE ?
        )`);
        const searchTerm = `%${q.trim()}%`;
        whereParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
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
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        ${whereClause}
      `;
      
      const [countResult] = await pool.execute(countQuery, whereParams);
      const totalTours = countResult[0].total;

      // Get tours with ENHANCED search including categories and city_slug
      const toursQuery = `
        SELECT 
          t.*,
          COALESCE(tc.title, 'Tour Title Not Available') as title,
          tc.category,
          tc.duration,
          tc.description,
          tc.availability,
          COALESCE(ct_city.name, c.name) as city_name,
          c.name as original_city_name,
          COALESCE(cat_trans.name, cat.name) as category_type,
          (SELECT AVG(rating) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as avg_rating,
          (SELECT COUNT(*) FROM reviews r WHERE r.tour_id = t.id AND r.is_active = true) as reviews_count
        FROM tours t
        LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
        LEFT JOIN cities c ON t.city_id = c.id
        LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
        LEFT JOIN tour_categories cat ON t.category_id = cat.id
        LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
        ${whereClause}
        ORDER BY 
          CASE WHEN t.featured_tag IS NOT NULL THEN 0 ELSE 1 END,
          t.views DESC,
          t.created_at DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

      const [tours] = await pool.execute(toursQuery, whereParams);
      
      // Add city_slug to each tour
      const processedTours = imageHelper.processArrayImages(tours, 'tour').map(tour => ({
        ...tour,
        city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name)
      }));

      res.json({
        success: true,
        data: {
          tours: processedTours,
          pagination: {
            currentPage: safePage,
            totalPages: Math.ceil(totalTours / safeLimit),
            totalItems: totalTours,
            itemsPerPage: safeLimit
          },
          searchQuery: q,
          appliedFilters: {
            city_id: city_id || null,
            category_id: category_id || null,
            min_price: min_price || null,
            max_price: max_price || null
          }
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
      processedReviews = imageHelper.processArrayImages(reviews, 'review')

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

  async submitTourReview(req, res) {
      try {
          const { tourId } = req.params;
          console.log('Submit tour review for tourId:', tourId);
          console.log('Submit tour review body:', req.body);
          console.log('Submit tour review files:', req.files);
          
          const { client_name, comment, language = 'en' } = req.body;

          // Validation (NO RATING)
          if (!client_name || !comment) {
              return res.status(400).json({
                  success: false,
                  message: 'Client name and comment are required'
              });
          }

          if (client_name.trim().length < 2) {
              return res.status(400).json({
                  success: false,
                  message: 'Client name must be at least 2 characters long'
              });
          }

          if (comment.trim().length < 10) {
              return res.status(400).json({
                  success: false,
                  message: 'Comment must be at least 10 characters long'
              });
          }

          // Check if tour exists and get tour details
          const [tourCheck] = await pool.execute(`
              SELECT
                  t.id,
                  COALESCE(tc.title, 'Tour') as tour_name,
                  t.status
              FROM tours t
              LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
              WHERE t.id = ?
          `, [language, tourId]);

          if (tourCheck.length === 0) {
              return res.status(404).json({
                  success: false,
                  message: 'Tour not found'
              });
          }

          if (tourCheck[0].status !== 'active') {
              return res.status(400).json({
                  success: false,
                  message: 'Reviews cannot be submitted for inactive tours'
              });
          }

          const tourName = tourCheck[0].tour_name;

          // Handle file uploads
          const client_image = req.files?.client_image?.[0]?.filename || null;
          const profile_image = req.files?.profile_image?.[0]?.filename || null;

          // Insert the review (NO RATING - set to null)
          const [result] = await pool.execute(`
              INSERT INTO reviews (
                  tour_id,
                  client_name,
                  rating,
                  comment,
                  tour_name,
                  review_date,
                  client_image,
                  profile_image,
                  is_active,
                  created_at
              ) VALUES (?, ?, null, ?, ?, CURDATE(), ?, ?, true, NOW())
          `, [
              tourId,
              client_name.trim(),
              comment.trim(),
              tourName,
              client_image,
              profile_image
          ]);

          // Get the inserted review with processed images
          const [newReview] = await pool.execute(`
              SELECT
                  id,
                  client_name,
                  rating,
                  comment,
                  tour_name,
                  review_date,
                  client_image,
                  profile_image,
                  created_at
              FROM reviews
              WHERE id = ?
          `, [result.insertId]);

          // Process the review with images using imageHelper
          const processedReview = imageHelper.processImages(newReview[0], 'review');

          res.status(201).json({
              success: true,
              message: 'Review submitted successfully',
              data: {
                  review: processedReview,
                  message: 'Thank you for your review! It will appear on the tour page shortly.'
              }
          });

      } catch (error) {
          console.error('❌ Submit tour review error:', error);

          res.status(500).json({
              success: false,
              message: 'Internal server error. Please try again later.'
          });
      }
  }


  async submitContactForm(req, res) {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    console.log('Submit contact form body:', req.body);
    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Name validation
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name must be at least 2 characters long'
      });
    }

    // Message validation
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long'
      });
    }

    // Prepare form data
    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim()
    };

    // Send email
    await emailService.sendContactForm(formData);

    // Later update: Saving to database for records
    // await this.saveContactFormToDatabase(formData);

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        submittedAt: new Date().toISOString(),
        reference: `CONTACT-${Date.now()}`
      }
    });

  } catch (error) {
    console.error('❌ Submit contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
}

async getClientCountry(req, res) {
  try {
    // Get client IP address
    const clientIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                     req.ip;

    // Clean IP address (remove IPv6 prefix if present)
    const cleanIP = clientIP ? clientIP.replace(/^::ffff:/, '') : null;
    
    console.log('Detected client IP:', cleanIP);

    // Get country information
    const country = countryService.getCountryFromIP(cleanIP);
    const allCountries = countryService.getAllCountries();

    res.json({
      success: true,
      data: {
        detectedCountry: country,
        allCountries: allCountries,
        clientIP: cleanIP
      }
    });

  } catch (error) {
    console.error('❌ Get client country error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not detect country',
      data: {
        detectedCountry: { code: 'EG', name: 'Egypt', dialCode: '+20' },
        allCountries: countryService.getAllCountries()
      }
    });
  }
}

// Get all categories for search dropdown
async getPublicCategories(req, res) {
  try {
    const { language = 'en' } = req.query;
    
    const [categories] = await pool.execute(`
      SELECT 
        cat.id,
        COALESCE(cat_trans.name, cat.name) as name,
        COUNT(t.id) as tours_count
      FROM tour_categories cat
      LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
      LEFT JOIN tours t ON cat.id = t.category_id AND t.status = 'active'
      WHERE cat.is_active = true
      GROUP BY cat.id, COALESCE(cat_trans.name, cat.name)
      HAVING tours_count > 0
      ORDER BY COALESCE(cat_trans.name, cat.name) ASC
    `, [language]);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Get public categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Enhanced search with quick suggestions
// Quick suggestions for homepage search
async getSearchSuggestions(req, res) {
  try {
    const { q = '', language = 'en', limit = 3 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: { cities: [], tours: [], categories: [] }
      });
    }
    
    const searchTerm = `%${q.trim()}%`;
    const safeLimit = Math.min(parseInt(limit), 3); // Only 3 each for quick suggestions

    // Get matching cities (top 3) - already includes slug
    const [cities] = await pool.execute(`
      SELECT 
        c.id,
        c.name as original_name,
        COALESCE(ct.name, c.name) as name,
        'city' as type,
        c.image,
        COUNT(t.id) as tours_count
      FROM cities c
      LEFT JOIN city_translations ct ON c.id = ct.city_id AND ct.language_code = ?
      LEFT JOIN tours t ON c.id = t.city_id AND t.status = 'active'
      WHERE COALESCE(ct.name, c.name) LIKE ? AND c.is_active = true
      GROUP BY c.id, COALESCE(ct.name, c.name), c.image
      HAVING tours_count > 0
      ORDER BY tours_count DESC
      LIMIT ${safeLimit}
    `, [language, searchTerm]);

    // Get matching categories (top 3)
    const [categories] = await pool.execute(`
      SELECT 
        cat.id,
        COALESCE(cat_trans.name, cat.name) as name,
        'category' as type,
        COUNT(t.id) as tours_count
      FROM tour_categories cat
      LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
      LEFT JOIN tours t ON cat.id = t.category_id AND t.status = 'active'
      WHERE COALESCE(cat_trans.name, cat.name) LIKE ? AND cat.is_active = true
      GROUP BY cat.id, COALESCE(cat_trans.name, cat.name)
      HAVING tours_count > 0
      ORDER BY tours_count DESC
      LIMIT ${safeLimit}
    `, [language, searchTerm]);

    // Get matching tours (top 3) with city_slug
    const [tours] = await pool.execute(`
      SELECT 
        t.id,
        t.city_id, 
        COALESCE(tc.title, 'Tour') as name,
        'tour' as type,
        t.cover_image as image,
        COALESCE(ct_city.name, c.name) as city_name,
        c.name as original_city_name,
        COALESCE(cat_trans.name, cat.name) as category_name
      FROM tours t
      LEFT JOIN tour_content tc ON t.id = tc.tour_id AND tc.language_code = ?
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN city_translations ct_city ON c.id = ct_city.city_id AND ct_city.language_code = ?
      LEFT JOIN tour_categories cat ON t.category_id = cat.id
      LEFT JOIN tour_category_translations cat_trans ON cat.id = cat_trans.category_id AND cat_trans.language_code = ?
      WHERE COALESCE(tc.title, 'Tour') LIKE ? AND t.status = 'active'
      ORDER BY t.views DESC
      LIMIT ${safeLimit}
    `, [language, language, language, searchTerm]);
    
    // Process cities with slug
    const processedCities = imageHelper.processArrayImages(cities, 'city').map(city => ({
      ...city,
      slug: SlugHelper.generateCitySlug(city.id, city.original_name)
    }));

    // Process tours with city_slug
    const processedTours = imageHelper.processArrayImages(tours, 'tour').map(tour => ({
      ...tour,
      city_slug: SlugHelper.generateCitySlug(tour.city_id, tour.original_city_name)
    }));
    
    res.json({
      success: true,
      data: {
        cities: processedCities,
        categories: categories, // No images for categories
        tours: processedTours
      }
    });
  } catch (error) {
    console.error('❌ Get search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

}

module.exports = new PublicController();