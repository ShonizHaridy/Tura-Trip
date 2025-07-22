const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const { adminValidation } = require('../middleware/validation');

// Public admin routes (no auth required)
router.post('/login', adminValidation.login, adminController.login);

// Protected admin routes (auth required)
router.use(authMiddleware); // Apply auth middleware to all routes below

router.get('/profile', adminController.getProfile);
router.put('/profile', adminValidation.updateProfile, adminController.updateProfile);
router.get('/verify-token', adminController.verifyToken);
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;