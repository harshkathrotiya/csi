const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Availability must be associated with a staff member'],
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model('User').findById(userId);
        return user && (user.role === 'staff' || user.role === 'admin');
      },
      message: 'Invalid staff member'
    }
  },
  dayOfWeek: {
    type: Number,
    required: [true, 'Please specify day of week (0-6, where 0 is Sunday)'],
    min: 0,
    max: 6
  },
  startTime: {
    type: String,
    required: [true, 'Please specify start time (HH:mm)'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
  },
  endTime: {
    type: String,
    required: [true, 'Please specify end time (HH:mm)'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  breakTime: [{
    startTime: {
      type: String,
      required: [true, 'Please specify break start time (HH:mm)'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
    },
    endTime: {
      type: String,
      required: [true, 'Please specify break end time (HH:mm)'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
    }
  }],
  specialDates: [{
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    startTime: String,
    endTime: String,
    note: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate time ranges
availabilitySchema.pre('save', function(next) {
  // Convert time strings to comparable format
  const convertTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = convertTime(this.startTime);
  const endMinutes = convertTime(this.endTime);

  if (startMinutes >= endMinutes) {
    return next(new Error('End time must be after start time'));
  }

  // Validate break times
  for (const breakPeriod of this.breakTime) {
    const breakStart = convertTime(breakPeriod.startTime);
    const breakEnd = convertTime(breakPeriod.endTime);

    if (breakStart >= breakEnd) {
      return next(new Error('Break end time must be after break start time'));
    }

    if (breakStart < startMinutes || breakEnd > endMinutes) {
      return next(new Error('Break time must be within availability hours'));
    }
  }

  next();
});

// Update timestamp before saving
availabilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
availabilitySchema.index({ staff: 1, dayOfWeek: 1 });
availabilitySchema.index({ 'specialDates.date': 1 });

module.exports = mongoose.model('Availability', availabilitySchema);