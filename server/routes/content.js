const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');
const { contentValidation } = require('../middleware/validation');
const { upload } = require('../middleware/upload');

// Apply auth middleware to all routes
router.use(authMiddleware);

// FAQ routes
router.get('/faqs', contentController.getAllFAQs);
router.get('/faqs/:id', contentController.getFAQById);
router.post('/faqs', contentValidation.createFAQ, contentController.createFAQ);
router.put('/faqs/:id', contentValidation.updateFAQ, contentController.updateFAQ);
router.delete('/faqs/:id', contentController.deleteFAQ);

// Reviews routes
router.get('/reviews', contentController.getAllReviews);
router.get('/reviews/:id', contentController.getReviewById);
router.post('/reviews', 
  upload.fields([
    { name: 'client_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 }
  ]),
  contentValidation.createReview, // We'll fix this validation
  contentController.createReview
);
router.put('/reviews/:id', contentController.updateReview);
router.delete('/reviews/:id', contentController.deleteReview);
router.patch('/reviews/:id/toggle-status', contentController.toggleReviewStatus);


// ================ PROMOTIONAL REVIEWS ROUTES (ADMIN ONLY) ================
router.get('/promotional-reviews', contentController.getAllPromotionalReviews);
router.post('/promotional-reviews',
  upload.fields([{ name: 'screenshot_image', maxCount: 1 }]),
  contentController.createPromotionalReview
);
router.put('/promotional-reviews/:id',
  upload.fields([{ name: 'screenshot_image', maxCount: 1 }]),
  contentController.updatePromotionalReview
);


module.exports = router;