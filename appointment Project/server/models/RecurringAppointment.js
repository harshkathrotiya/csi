const mongoose = require('mongoose');

const recurringAppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recurring appointment must be associated with a user']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Recurring appointment must be associated with a service']
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recurring appointment must be associated with a staff member'],
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model('User').findById(userId);
        return user && (user.role === 'staff' || user.role === 'admin');
      },
      message: 'Invalid staff member'
    }
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      required: true
    },
    interval: {
      type: Number,
      min: 1,
      default: 1,
      required: true
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31
    },
    weekOfMonth: {
      type: Number,
      min: 1,
      max: 5
    },
    customPattern: String
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 minute']
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  excludedDates: [{
    date: Date,
    reason: String
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  notes: String,
  notificationPreferences: {
    reminderEnabled: {
      type: Boolean,
      default: true
    },
    reminderBefore: {
      type: Number,
      default: 24, // hours
      min: 1
    },
    channels: [{
      type: String,
      enum: ['email', 'sms', 'push']
    }]
  },
  metadata: {
    type: Map,
    of: String
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
recurringAppointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validate recurrence pattern based on frequency
recurringAppointmentSchema.pre('save', function(next) {
  const pattern = this.recurrencePattern;
  
  switch (pattern.frequency) {
    case 'weekly':
      if (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0) {
        return next(new Error('Days of week are required for weekly recurrence'));
      }
      break;
    case 'monthly':
      if (!pattern.dayOfMonth && !pattern.weekOfMonth) {
        return next(new Error('Either day of month or week of month is required for monthly recurrence'));
      }
      break;
    case 'custom':
      if (!pattern.customPattern) {
        return next(new Error('Custom pattern is required for custom frequency'));
      }
      break;
  }
  next();
});

// Generate next occurrence date
recurringAppointmentSchema.methods.getNextOccurrence = function(fromDate = new Date()) {
  const pattern = this.recurrencePattern;
  let nextDate = new Date(Math.max(fromDate, this.startDate));

  switch (pattern.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + pattern.interval);
      break;
    case 'weekly':
      // Find the next available day of week
      while (!pattern.daysOfWeek.includes(nextDate.getDay())) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      break;
    case 'monthly':
      if (pattern.dayOfMonth) {
        nextDate.setMonth(nextDate.getMonth() + pattern.interval);
        nextDate.setDate(pattern.dayOfMonth);
      } else {
        // Handle week of month logic
        // This is a simplified version and might need more complex logic
        nextDate.setMonth(nextDate.getMonth() + pattern.interval);
      }
      break;
  }

  // Check if the next occurrence is within the valid date range
  return nextDate <= this.endDate ? nextDate : null;
};

// Indexes for efficient querying
recurringAppointmentSchema.index({ user: 1, status: 1 });
recurringAppointmentSchema.index({ staff: 1, status: 1 });
recurringAppointmentSchema.index({ service: 1 });
recurringAppointmentSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('RecurringAppointment', recurringAppointmentSchema);