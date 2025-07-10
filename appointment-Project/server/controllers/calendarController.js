const User = require('../models/User');
const googleCalendar = require('../utils/googleCalendar');

// Get Google Calendar auth URL
exports.getAuthUrl = async (req, res) => {
  try {
    const authUrl = await googleCalendar.getAuthUrl();
    res.status(200).json({
      success: true,
      data: { authUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating auth URL'
    });
  }
};

// Handle Google Calendar OAuth callback
exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await googleCalendar.setCredentials(code);

    // Store tokens in user document
    await User.findByIdAndUpdate(req.user.id, {
      'googleCalendar.accessToken': tokens.access_token,
      'googleCalendar.refreshToken': tokens.refresh_token,
      'googleCalendar.connected': true
    });

    res.status(200).json({
      success: true,
      message: 'Google Calendar connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error connecting Google Calendar'
    });
  }
};

// Sync appointment to Google Calendar
exports.syncAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId)
      .populate('user', 'name email')
      .populate('staff', 'name email')
      .populate('service', 'name');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const event = await googleCalendar.createEvent(appointment);

    // Store Google Calendar event ID
    appointment.googleCalendarEventId = event.id;
    await appointment.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error syncing appointment to Google Calendar'
    });
  }
};

// Update synced appointment in Google Calendar
exports.updateSyncedAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId)
      .populate('user', 'name email')
      .populate('staff', 'name email')
      .populate('service', 'name');

    if (!appointment || !appointment.googleCalendarEventId) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not synced with Google Calendar'
      });
    }

    const event = await googleCalendar.updateEvent(
      appointment.googleCalendarEventId,
      appointment
    );

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating synced appointment'
    });
  }
};

// Remove appointment from Google Calendar
exports.removeSyncedAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || !appointment.googleCalendarEventId) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not synced with Google Calendar'
      });
    }

    await googleCalendar.deleteEvent(appointment.googleCalendarEventId);

    // Remove Google Calendar event ID
    appointment.googleCalendarEventId = undefined;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment removed from Google Calendar'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing synced appointment'
    });
  }
};