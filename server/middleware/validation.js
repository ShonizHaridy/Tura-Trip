const { body, param, query, validationResult } = require('express-validator');

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
const cityValidation = {
  create: [
    body('name').notEmpty().withMessage('City name is required'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
    handleValidationErrors
  ],
  
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid city ID is required'),
    body('name').optional().notEmpty().withMessage('City name cannot be empty'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
    handleValidationErrors
  ]
};

// Category validation rules
const categoryValidation = {
  create: [
    body('name').notEmpty().withMessage('Category name is required'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
    handleValidationErrors
  ],
  
  update: [
    param('id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
    body('name').optional().notEmpty().withMessage('Category name cannot be empty'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
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