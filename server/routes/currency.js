const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Currency management
router.get('/currencies', currencyController.getAllCurrencies);
router.put('/currencies/:id', currencyController.updateCurrency);

// Exchange rates
router.get('/rates', currencyController.getExchangeRates);
router.post('/rates/refresh', currencyController.refreshRates);

// Currency conversion
router.post('/convert', currencyController.convertCurrency);

// Organizer commission management - THESE ROUTES WERE MISSING
router.get('/commission', currencyController.getOrganizerCommission);
router.post('/commission', currencyController.updateOrganizerCommission);
router.put('/commission/:currency_code', currencyController.updateOrganizerCommission);
// router.put('/commission/:currencyCode', currencyController.updateCommission);
router.delete('/commission/:currency_code', currencyController.deleteOrganizerCommission);

module.exports = router;