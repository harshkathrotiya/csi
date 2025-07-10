const Waitlist = require('../models/Waitlist');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('../utils/emailNotifications');

// Add user to waitlist
exports.addToWaitlist = async (req, res) => {
  try {
    const { serviceId, preferredStaffId, preferredDate, notes } = req.body;

    const waitlistEntry = await Waitlist.create({
      user: req.user.id,
      service: serviceId,
      preferredStaff: preferredStaffId,
      preferredDate,
      notes
    });

    res.status(201).json({
      success: true,
      data: waitlistEntry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's waitlist entries
exports.getUserWaitlist = async (req, res) => {
  try {
    const waitlistEntries = await Waitlist.find({ user: req.user.id })
      .populate('service')
      .populate('preferredStaff', 'name email');

    res.status(200).json({
      success: true,
      data: waitlistEntries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Remove from waitlist
exports.removeFromWaitlist = async (req, res) => {
  try {
    const waitlistEntry = await Waitlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from waitlist'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Notify waitlisted users when slot becomes available
exports.notifyWaitlistedUsers = async (serviceId, staffId, availableDate) => {
  try {
    const waitlistEntries = await Waitlist.find({
      service: serviceId,
      preferredStaff: staffId || { $exists: true },
      notified: false
    }).populate('user');

    for (const entry of waitlistEntries) {
      // Send email notification
      await sendEmail(
        entry.user.email,
        'Appointment Slot Available',
        `A slot is now available for your waitlisted service. Please book soon as slots are limited.`
      );

      // Update entry as notified
      entry.notified = true;
      await entry.save();
    }
  } catch (error) {
    console.error('Error notifying waitlisted users:', error);
  }
};