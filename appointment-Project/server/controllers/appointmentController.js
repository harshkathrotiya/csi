const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { serviceId, staffId, startTime, endTime, isRecurring, recurringPattern } = req.body;

    // Validate service and staff
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const staff = await User.findOne({ _id: staffId, role: { $in: ['staff', 'admin'] } });
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check for scheduling conflicts
    const conflictingAppointment = await Appointment.findOne({
      staff: staffId,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is not available'
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: service.price * 100, // Amount in paise
      currency: 'INR',
      receipt: `appointment_${Date.now()}`
    });

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user.id,
      staff: staffId,
      service: serviceId,
      startTime,
      endTime,
      isRecurring,
      recurringPattern,
      paymentDetails: {
        razorpayOrderId: order.id,
        amount: service.price
      }
    });

    res.status(201).json({
      success: true,
      appointment,
      paymentOrder: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get user appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('service', 'name duration price')
      .populate('staff', 'name email')
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
};

// Get staff appointments
exports.getStaffAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ staff: req.user.id })
      .populate('user', 'name email')
      .populate('service', 'name duration price')
      .sort({ startTime: 1 });

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
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (req.user.role === 'user' && appointment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Handle Razorpay webhook
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (signature === digest) {
      const { payload } = req.body;
      const { payment } = payload;

      const appointment = await Appointment.findOne({
        'paymentDetails.razorpayOrderId': payment.order_id
      });

      if (appointment) {
        appointment.paymentStatus = 'paid';
        appointment.paymentDetails.razorpayPaymentId = payment.id;
        await appointment.save();
      }

      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ status: 'invalid signature' });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};