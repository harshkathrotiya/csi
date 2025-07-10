const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { getAllUsers, updateUserRole } = require('../controllers/userController');

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', getAllUsers);
router.patch('/:userId/role', updateUserRole);

module.exports = router;