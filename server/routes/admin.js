const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const { adminValidation } = require('../middleware/validation');

// Public admin routes (no auth required)
router.post('/login', adminValidation.login, adminController.login);

const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Forgot password validation
const forgotPasswordValidation = [
  body('admin_code').notEmpty().withMessage('Admin code is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('id_number').notEmpty().withMessage('ID number is required'),
  handleValidationErrors
];

// Reset password validation
const resetPasswordValidation = [
  body('admin_code').notEmpty().withMessage('Admin code is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('id_number').notEmpty().withMessage('ID number is required'),
  body('verification_code').notEmpty().withMessage('Verification code is required'),
  body('new_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidationErrors
];

// Add these routes BEFORE router.use(authMiddleware)
router.post('/forgot-password', forgotPasswordValidation, adminController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, adminController.resetPassword);

// Protected admin routes (auth required)
router.use(authMiddleware); // Apply auth middleware to all routes below

router.get('/profile', adminController.getProfile);
router.put('/profile', adminValidation.updateProfile, adminController.updateProfile);
router.get('/verify-token', adminController.verifyToken);
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;