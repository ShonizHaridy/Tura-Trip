const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const authMiddleware = require('../middleware/auth');
const { categoryValidation } = require('../middleware/validation');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Categories CRUD operations
router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategoryById);
router.post('/', categoryValidation.create, categoriesController.createCategory);
router.put('/:id', categoryValidation.update, categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

// Category operations
router.patch('/:id/toggle-status', categoriesController.toggleStatus);

module.exports = router;