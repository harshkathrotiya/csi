const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimitMiddleware');
const weatherController = require('../controllers/weatherController');

// Apply rate limiting to all weather routes
router.use(apiLimiter);

// Protected weather routes
router.get('/city/:city', protect, weatherController.getWeatherByCity);
router.get('/coordinates', protect, weatherController.getWeatherByCoordinates);

module.exports = router;