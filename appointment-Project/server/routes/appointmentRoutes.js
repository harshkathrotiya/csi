const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  createAppointment,
  getUserAppointments,
  getStaffAppointments,
  updateAppointmentStatus,
  handlePaymentWebhook
} = require('../controllers/appointmentController');

// Protect all routes
router.use(protect);

// User routes
router.post('/', createAppointment);
router.get('/my-appointments', getUserAppointments);

// Staff routes
router.get('/staff-schedule', authorize('staff', 'admin'), getStaffAppointments);

// Shared routes (accessible by both user and staff)
router.patch('/:id/status', updateAppointmentStatus);

// Payment webhook (public route)
router.post('/payment-webhook', handlePaymentWebhook);

// Admin routes
router.get('/all', authorize('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('staff', 'name email')
      .populate('service', 'name duration price')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Analytics routes (admin only)
router.get('/analytics', authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Monthly statistics
    const monthlyStats = await Appointment.aggregate([
      {
        $match: {
          startTime: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['completed', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          totalRevenue: { $sum: '$paymentDetails.amount' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    // Most booked services
    const popularServices = await Appointment.aggregate([
      {
        $match: {
          startTime: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['completed', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
          revenue: { $sum: '$paymentDetails.amount' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Busy hours analysis
    const busyHours = await Appointment.aggregate([
      {
        $match: {
          startTime: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['completed', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: { $hour: '$startTime' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyStats: monthlyStats[0] || {},
        popularServices,
        busyHours
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;