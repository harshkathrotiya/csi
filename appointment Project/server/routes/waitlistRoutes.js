const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  addToWaitlist,
  getUserWaitlist,
  removeFromWaitlist
} = require('../controllers/waitlistController');

// Protect all routes
router.use(protect);

// Waitlist routes
router.post('/', addToWaitlist);
router.get('/my-waitlist', getUserWaitlist);
router.delete('/:id', removeFromWaitlist);

module.exports = router;