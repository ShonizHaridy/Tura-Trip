const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');
const authMiddleware = require('../middleware/auth');
const { upload, processImage } = require('../middleware/upload');
const { tourValidation } = require('../middleware/validation');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Tours CRUD operations
router.get('/', toursController.getAllTours);
router.get('/:id', toursController.getTourById);
router.post('/', 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'tourImages', maxCount: 10 }
  ]),
  processImage,
  tourValidation.create,
  toursController.createTour
);
router.put('/:id', 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'tourImages', maxCount: 10 }
  ]),
  processImage,
  tourValidation.update,
  toursController.updateTour
);
router.delete('/:id', toursController.deleteTour);

// Tour status and operations
router.patch('/:id/status', toursController.updateTourStatus);
router.patch('/:id/views', toursController.incrementViews);

module.exports = router;