const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Staff must be associated with a user account'],
    unique: true,
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model('User').findById(userId);
        return user && (user.role === 'staff' || user.role === 'admin');
      },
      message: 'Invalid user role for staff member'
    }
  },
  specialties: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    experienceYears: {
      type: Number,
      min: 0
    },
    certifications: [{
      name: String,
      issuedBy: String,
      issueDate: Date,
      expiryDate: Date,
      verificationUrl: String
    }]
  }],
  schedule: {
    regularHours: [{
      day: {
        type: Number,
        required: true,
        min: 0,
        max: 6
      },
      shifts: [{
        startTime: {
          type: String,
          required: true,
          match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
        },
        endTime: {
          type: String,
          required: true,
          match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)']
        },
        breakTime: [{
          startTime: String,
          endTime: String
        }]
      }]
    }],
    timeOff: [{
      startDate: Date,
      endDate: Date,
      reason: String,
      type: {
        type: String,
        enum: ['vacation', 'sick', 'personal', 'other']
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    }]
  },
  preferences: {
    maxDailyAppointments: {
      type: Number,
      min: 0
    },
    breakBetweenAppointments: {
      type: Number,
      min: 0,
      default: 15 // minutes
    },
    preferredServices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }],
    notificationPreferences: {
      email: {
        enabled: Boolean,
        frequency: String
      },
      sms: {
        enabled: Boolean,
        frequency: String
      },
      push: {
        enabled: Boolean,
        frequency: String
      }
    }
  },
  performance: {
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    completedAppointments: {
      type: Number,
      default: 0
    },
    cancelledAppointments: {
      type: Number,
      default: 0
    },
    noShowAppointments: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be longer than 500 characters']
  },
  profileImage: {
    url: String,
    publicId: String
  },
  documents: [{
    type: {
      type: String,
      required: true,
      enum: ['id_proof', 'certification', 'training', 'other']
    },
    name: String,
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
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

// Update timestamp before saving
staffSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validate time ranges in schedule
staffSchema.pre('save', function(next) {
  const validateTimeRange = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return end > start;
  };

  for (const daySchedule of this.schedule.regularHours) {
    for (const shift of daySchedule.shifts) {
      if (!validateTimeRange(shift.startTime, shift.endTime)) {
        return next(new Error('End time must be after start time'));
      }

      // Validate break times
      for (const breakTime of shift.breakTime || []) {
        if (!validateTimeRange(breakTime.startTime, breakTime.endTime)) {
          return next(new Error('Break end time must be after break start time'));
        }
      }
    }
  }
  next();
});

// Indexes for efficient querying
staffSchema.index({ user: 1 });
staffSchema.index({ status: 1 });
staffSchema.index({ 'specialties.service': 1 });
staffSchema.index({ 'performance.averageRating': -1 });

// Virtual for full name
staffSchema.virtual('fullName').get(function() {
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
});

// Method to check availability
staffSchema.methods.isAvailable = async function(date, startTime, endTime) {
  // Convert date to day of week (0-6)
  const dayOfWeek = date.getDay();

  // Check regular schedule
  const daySchedule = this.schedule.regularHours.find(h => h.day === dayOfWeek);
  if (!daySchedule) return false;

  // Check if time falls within any shift
  const isWithinShift = daySchedule.shifts.some(shift => {
    return startTime >= shift.startTime && endTime <= shift.endTime;
  });
  if (!isWithinShift) return false;

  // Check time off
  const hasTimeOff = this.schedule.timeOff.some(timeOff => {
    return date >= timeOff.startDate && date <= timeOff.endDate && timeOff.status === 'approved';
  });
  if (hasTimeOff) return false;

  // Additional availability checks can be added here (e.g., existing appointments)
  return true;
};

module.exports = mongoose.model('Staff', staffSchema);