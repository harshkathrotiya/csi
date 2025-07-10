const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Waitlist entry must be associated with a user']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Waitlist entry must be associated with a service']
  },
  preferredStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(userId) {
        if (!userId) return true; // Optional field
        const user = await mongoose.model('User').findById(userId);
        return user && (user.role === 'staff' || user.role === 'admin');
      },
      message: 'Invalid staff member'
    }
  },
  preferredDates: [{
    date: {
      type: Date,
      required: true
    },
    timeSlots: [{
      type: String,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
    }]
  }],
  status: {
    type: String,
    enum: ['active', 'notified', 'booked', 'expired', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    pushNotification: {
      type: Boolean,
      default: true
    }
  },
  notes: {
    type: String,
    trim: true
  },
  notificationHistory: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'delivered', 'read'],
      required: true
    },
    message: String
  }],
  expiryDate: {
    type: Date,
    required: true
  },
  convertedToAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
waitlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validate preferred dates are in the future
waitlistSchema.pre('save', function(next) {
  const now = new Date();
  for (const preferredDate of this.preferredDates) {
    if (preferredDate.date < now) {
      return next(new Error('Preferred dates must be in the future'));
    }
  }
  next();
});

// Set expiry date if not provided
waitlistSchema.pre('save', function(next) {
  if (!this.expiryDate) {
    // Default expiry date is 30 days from creation
    this.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Indexes for efficient querying
waitlistSchema.index({ user: 1, service: 1, status: 1 });
waitlistSchema.index({ service: 1, status: 1, priority: -1 });
waitlistSchema.index({ status: 1, expiryDate: 1 });
waitlistSchema.index({ 'preferredDates.date': 1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);