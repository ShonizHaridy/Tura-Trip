// Application constants
const APP_CONSTANTS = {
  // Supported languages
  LANGUAGES: {
    EN: 'en',
    RU: 'ru',
    IT: 'it',
    DE: 'de'
  },

  // Tour statuses
  TOUR_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft'
  },

  // Featured tags
  FEATURED_TAGS: {
    POPULAR: 'popular',
    GREAT_VALUE: 'great_value',
    NEW: 'new'
  },

  // Admin roles
  ADMIN_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager'
  },

  // Currency codes
  CURRENCIES: {
    USD: 'USD',
    EUR: 'EUR',
    RUB: 'RUB',
    KZT: 'KZT',
    UAH: 'UAH'
  },

  // Rating limits
  RATING: {
    MIN: 1,
    MAX: 5
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_TOUR_IMAGES: 10
  },

  // API response messages
  MESSAGES: {
    SUCCESS: {
      CREATED: 'Created successfully',
      UPDATED: 'Updated successfully',
      DELETED: 'Deleted successfully',
      LOGIN: 'Login successful'
    },
    ERROR: {
      NOT_FOUND: 'Resource not found',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Access forbidden',
      VALIDATION_FAILED: 'Validation failed',
      INTERNAL_ERROR: 'Internal server error',
      INVALID_CREDENTIALS: 'Invalid credentials'
    }
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100 // per window
  }
};

module.exports = APP_CONSTANTS;