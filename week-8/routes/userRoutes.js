const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  signup,
  login,
  getProfile,
  updateProfile,
  uploadAvatar,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.use(protect); // All routes after this middleware will be protected

// User routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/profile/avatar', uploadAvatar);

// Admin only routes
router.get('/users', restrictTo('admin'), getAllUsers);
router.delete('/users/:id', restrictTo('admin'), deleteUser);

module.exports = router;