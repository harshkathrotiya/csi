const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  register,
  login,
  setup2FA,
  enable2FA,
  verify2FAAndLogin,
  getCurrentUser
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa', verify2FAAndLogin);

// Protected routes
router.use(protect); // All routes below this middleware will be protected

// Get current user
router.get('/me', getCurrentUser);

// 2FA setup routes
router.post('/setup-2fa', setup2FA);
router.post('/enable-2fa', enable2FA);

// Admin only routes
router.post('/register-staff', authorize('admin'), register);

module.exports = router;