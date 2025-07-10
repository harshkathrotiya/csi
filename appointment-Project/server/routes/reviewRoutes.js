const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createReview,
  getServiceReviews,
  getStaffReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Protect all routes
router.use(protect);

// Review routes
router.post('/', createReview);
router.get('/service/:serviceId', getServiceReviews);
router.get('/staff/:staffId', getStaffReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;