const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

const { upload } = require('../middleware/upload'); // Add this import


// Homepage data
router.get('/homepage', publicController.getHomepageData);

// Navigation data
router.get('/cities/header', publicController.getCitiesForHeader);

// More featured tours for homepage view more
router.get('/homepage/more-tours', publicController.getMoreFeaturedTours);

// City pages
router.get('/city/:cityName', publicController.getCityPageData);

// Tour detail pages
router.get('/city/:cityName/tour/:tourId', publicController.getTourDetailData);

// Update this route to handle image uploads
router.post('/tours/:tourId/reviews',
    upload.fields([
        { name: 'client_image', maxCount: 1 },
        { name: 'profile_image', maxCount: 1 }
    ]),
    publicController.submitTourReview
);


// More like this trips - view all
router.get('/tours/:tourId/more-like-this', publicController.getMoreLikeThisAll);

// Content
router.get('/faqs', publicController.getPublicFAQs);
router.get('/reviews', publicController.getPublicReviews);

// Search
router.get('/search', publicController.searchTours);

// Currency conversion for public
router.get('/currency/convert', publicController.getCurrencyConversion);

router.get('/promotional-reviews', publicController.getPromotionalReviews);

router.post('/contact', publicController.submitContactForm);
router.get('/client-country', publicController.getClientCountry);


module.exports = router;