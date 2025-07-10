const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getAuthUrl,
  handleCallback,
  syncAppointment,
  updateSyncedAppointment,
  removeSyncedAppointment
} = require('../controllers/calendarController');

// Protect all routes
router.use(protect);

// Google Calendar OAuth routes
router.get('/auth-url', getAuthUrl);
router.get('/callback', handleCallback);

// Calendar sync routes
router.post('/sync/:appointmentId', syncAppointment);
router.put('/sync/:appointmentId', updateSyncedAppointment);
router.delete('/sync/:appointmentId', removeSyncedAppointment);

module.exports = router;