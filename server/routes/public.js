const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Homepage data
router.get('/homepage', publicController.getHomepageData);

// Navigation data
router.get('/cities/header', publicController.getCitiesForHeader);

// City pages
router.get('/city/:cityName', publicController.getCityPageData);

// Tour detail pages
router.get('/city/:cityName/tour/:tourId', publicController.getTourDetailData);

// Content
router.get('/faqs', publicController.getPublicFAQs);
router.get('/reviews', publicController.getPublicReviews);

// Search
router.get('/search', publicController.searchTours);

// Currency conversion for public
router.get('/currency/convert', publicController.getCurrencyConversion);

router.get('/promotional-reviews', publicController.getPromotionalReviews);


module.exports = router;