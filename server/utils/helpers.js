const crypto = require('crypto');
const path = require('path');

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(6).toString('hex');
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
};

// Format price with currency
const formatPrice = (price, currency = 'USD') => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'RUB': '₽',
    'KZT': '₸',
    'UAH': '₴'
  };
  
  return `${symbols[currency] || currency} ${parseFloat(price).toFixed(2)}`;
};

// Calculate discounted price
const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  const discount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discount;
};

// Generate tour slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Validate language code
const isValidLanguage = (langCode) => {
  const validLanguages = ['en', 'ru', 'it', 'de'];
  return validLanguages.includes(langCode);
};

// Sanitize search query
const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
};

// Format date for database
const formatDateForDB = (date) => {
  if (!date) return null;
  
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Calculate pagination info
const calculatePagination = (totalItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return {
    totalItems,
    totalPages,
    currentPage: parseInt(currentPage),
    itemsPerPage: parseInt(itemsPerPage),
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null
  };
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate API response
const apiResponse = (success, data = null, message = '', errors = null) => {
  const response = { success };
  
  if (message) response.message = message;
  if (data !== null) response.data = data;
  if (errors) response.errors = errors;
  
  return response;
};

// Parse JSON safely
const safeJSONParse = (str, defaultValue = null) => {
  try {
    // If it's already an object, return it
    if (typeof str === 'object' && str !== null) {
      return str;
    }
    
    // If it's a string, try to parse it
    if (typeof str === 'string') {
      return JSON.parse(str);
    }
    
    // If it's neither, return default
    return defaultValue;
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return defaultValue;
  }
};

module.exports = {
  generateUniqueFilename,
  formatPrice,
  calculateDiscountedPrice,
  generateSlug,
  isValidLanguage,
  sanitizeSearchQuery,
  formatDateForDB,
  calculatePagination,
  isValidEmail,
  apiResponse,
  safeJSONParse
};