const express = require('express');
const router = express.Router();

// API Routes
router.use('/auth', require('./authRoutes'));
router.use('/services', require('./serviceRoutes'));
router.use('/appointments', require('./appointmentRoutes'));
router.use('/staff', require('./staffRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/waitlist', require('./waitlistRoutes'));
router.use('/calendar', require('./calendarRoutes'));
router.use('/admin/users', require('./userRoutes'));

// Health check route
router.use('/health', require('./healthRoutes'));

module.exports = router;