const { body, param, query, validationResult } = require('express-validator');

const debugRequest = (label) => (req, res, next) => {
  console.log(`\n=== ${label} ===`);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  console.log('Content-Type:', req.headers['content-type']);
  
  if (req.body.translations) {
    console.log('Translations type:', typeof req.body.translations);
    console.log('Translations value:', req.body.translations);
  }
  
  console.log(`=== END ${label} ===\n`);
  next();
};

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Admin validation rules
const adminValidation = {
  login: [
    // Accept either email OR admin_id
    body().custom((value, { req }) => {
      const { email, admin_id } = req.body;
      
      if (!email && !admin_id) {
        throw new Error('Please provide either email or admin ID');
      }
      
      if (email && !email.match(/^\S+@\S+\.\S+$/)) {
        throw new Error('Please provide a valid email');
      }
      
      if (admin_id && admin_id.length < 3) {
        throw new Error('Admin ID must be at least 3 characters');
      }
      
      return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
  ],
  
  updateProfile: [
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('currentPassword').optional().isLength({ min: 6 }).withMessage('Current password must be at least 6 characters'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    handleValidationErrors
  ]
};

// Tour validation rules
const tourValidation = {
  create: [
    body('city_id').isInt({ min: 1 }).withMessage('Valid city ID is required'),
    body('category_id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('price_adult').isFloat({ min: 0 }).withMessage('Adult price must be a positive number'),
    body('price_child').isFloat({ min: 0 }).withMessage('Child price must be a positive number'),
    body('discount_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0-100'),
    body('featured_tag').optional().isIn(['popular', 'great_value', 'new']).withMessage('Invalid featured tag'),
    handleValidationErrors
  ],
  
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid tour ID is required'),
    body('city_id').optional().isInt({ min: 1 }).withMessage('Valid city ID is required'),
    body('category_id').optional().isInt({ min: 1 }).withMessage('Valid category ID is required'),
    body('price_adult').optional().isFloat({ min: 0 }).withMessage('Adult price must be a positive number'),
    body('price_child').optional().isFloat({ min: 0 }).withMessage('Child price must be a positive number'),
    body('discount_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0-100'),
    body('featured_tag').optional().isIn(['popular', 'great_value', 'new']).withMessage('Invalid featured tag'),
    handleValidationErrors
  ]
};

// City validation rules
// City validation rules
const cityValidation = {
  create: [

    debugRequest('CITY CREATE'),

    // Validate the translations object structure
    body('translations').custom((value) => {
      // Handle both string (from FormData) and object
      let translations;
      try {
        translations = typeof value === 'string' ? JSON.parse(value) : value;
      } catch (error) {
        throw new Error('Invalid translations format');
      }
      
      if (!translations || typeof translations !== 'object') {
        throw new Error('Translations object is required');
      }
      
      return true;
    }),
    
    // Validate each required language - at least English name is required
    body('translations').custom((value) => {
      let translations = typeof value === 'string' ? JSON.parse(value) : value;
      
      // Check required languages exist
      const requiredLanguages = ['en', 'ru', 'it', 'de'];
      for (const lang of requiredLanguages) {
        if (!translations[lang]) {
          throw new Error(`Translation for ${lang} is required`);
        }
      }
      
      // English name is mandatory
      if (!translations.en.name || translations.en.name.trim() === '') {
        throw new Error('English city name is required');
      }
      
      // Validate field lengths for all languages
      for (const lang of requiredLanguages) {
        const translation = translations[lang];
        
        if (translation.name && translation.name.length > 100) {
          throw new Error(`${lang.toUpperCase()} city name cannot exceed 100 characters`);
        }
        
        if (translation.tagline && translation.tagline.length > 255) {
          throw new Error(`${lang.toUpperCase()} tagline cannot exceed 255 characters`);
        }
        
        if (translation.description && translation.description.length > 1000) {
          throw new Error(`${lang.toUpperCase()} description cannot exceed 1000 characters`);
        }
        
        // If name is provided for non-English, it cannot be empty
        if (lang !== 'en' && translation.name && translation.name.trim() === '') {
          throw new Error(`${lang.toUpperCase()} city name cannot be empty if provided`);
        }
      }
      
      return true;
    }),
    
    // Validate is_active field
    body('is_active').optional().isBoolean().withMessage('Status must be boolean'),
    
    handleValidationErrors
  ],
  
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid city ID is required'),
    
    // For updates, translations are optional but if provided, should be valid
    body('translations').optional().custom((value) => {
      let translations;
      try {
        translations = typeof value === 'string' ? JSON.parse(value) : value;
      } catch (error) {
        throw new Error('Invalid translations format');
      }
      
      if (translations && typeof translations !== 'object') {
        throw new Error('Translations must be an object');
      }
      
      return true;
    }),
    
    // If translations are provided, validate structure and content
    body('translations').optional().custom((value) => {
      if (!value) return true; // Skip if not provided
      
      let translations = typeof value === 'string' ? JSON.parse(value) : value;
      const requiredLanguages = ['en', 'ru', 'it', 'de'];
      
      for (const lang of requiredLanguages) {
        if (translations[lang]) {
          const translation = translations[lang];
          
          // If name is provided, validate it
          if (translation.name !== undefined) {
            if (translation.name.trim() === '') {
              throw new Error(`${lang.toUpperCase()} city name cannot be empty`);
            }
            if (translation.name.length > 100) {
              throw new Error(`${lang.toUpperCase()} city name cannot exceed 100 characters`);
            }
          }
          
          // Validate tagline length
          if (translation.tagline && translation.tagline.length > 255) {
            throw new Error(`${lang.toUpperCase()} tagline cannot exceed 255 characters`);
          }
          
          // Validate description length
          if (translation.description && translation.description.length > 1000) {
            throw new Error(`${lang.toUpperCase()} description cannot exceed 1000 characters`);
          }
        }
      }
      
      return true;
    }),
    
    // Validate is_active field
    body('is_active').optional().isBoolean().withMessage('Status must be boolean'),
    
    handleValidationErrors
  ]
};

// Category validation rules
const categoryValidation = {
  create: [
    // Validate the translations object structure
    body('translations').isObject().withMessage('Translations object is required'),
    
    // Validate each required language
    body('translations.en.name').notEmpty().withMessage('English category name is required'),
    body('translations.ru.name').notEmpty().withMessage('Russian category name is required'),
    body('translations.it.name').notEmpty().withMessage('Italian category name is required'),
    body('translations.de.name').notEmpty().withMessage('German category name is required'),
    
    // Optional description validation for each language
    body('translations.*.description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
    
    handleValidationErrors
  ],
  
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
    
    // For updates, translations are optional but if provided, should be valid
    body('translations').optional().isObject().withMessage('Translations must be an object'),
    
    // If any translation is provided, validate its structure
    body('translations.*.name').optional().notEmpty().withMessage('Translation name cannot be empty'),
    body('translations.*.description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
    
    // Optional status validation
    body('is_active').optional().isBoolean().withMessage('Status must be boolean'),
    
    handleValidationErrors
  ]
};

// Content validation rules
const contentValidation = {
  createFAQ: [
    body('language_code').isIn(['en', 'ru', 'it', 'de']).withMessage('Invalid language code'),
    body('question').notEmpty().withMessage('Question is required'),
    body('answer').notEmpty().withMessage('Answer is required'),
    handleValidationErrors
  ],
  
  createReview: [
    body('tour_id').isInt({ min: 1 }).withMessage('Valid tour ID is required'),
    body('client_name').notEmpty().withMessage('Client name is required'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
    body('comment').notEmpty().withMessage('Comment is required'),
    body('review_date').optional().isISO8601().withMessage('Valid date is required'),
    handleValidationErrors
  ]
};

module.exports = {
  adminValidation,
  tourValidation,
  cityValidation,
  categoryValidation,
  contentValidation,
  handleValidationErrors
};