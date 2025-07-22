const express = require('express');
const router = express.Router();
const citiesController = require('../controllers/citiesController');
const authMiddleware = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');
const { cityValidation } = require('../middleware/validation');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Cities CRUD operations
router.get('/', citiesController.getAllCities);
router.get('/:id', citiesController.getCityById);
router.post('/', 
  upload.single('image'),
  processImage,
  cityValidation.create,
  citiesController.createCity
);
router.put('/:id', 
  upload.single('image'),
  processImage,
  cityValidation.update,
  citiesController.updateCity
);
router.delete('/:id', citiesController.deleteCity);

// City operations
router.patch('/:id/toggle-status', citiesController.toggleStatus);

module.exports = router;