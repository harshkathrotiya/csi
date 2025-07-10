const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Review must be associated with an appointment']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must be associated with a user']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Review must be associated with a service']
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must be associated with a staff member'],
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model('User').findById(userId);
        return user && (user.role === 'staff' || user.role === 'admin');
      },
      message: 'Invalid staff member'
    }
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  serviceRating: {
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  staffRating: {
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot be longer than 500 characters']
  },
  images: [{
    url: String,
    caption: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'reported'],
    default: 'pending'
  },
  moderationNotes: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Reply cannot be longer than 200 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
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

// Ensure one review per appointment per user
reviewSchema.index({ appointment: 1, user: 1 }, { unique: true });

// Additional indexes for efficient querying
reviewSchema.index({ service: 1, rating: -1 });
reviewSchema.index({ staff: 1, rating: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

// Update timestamp before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average ratings
reviewSchema.statics.calculateAverageRatings = async function(serviceId, staffId) {
  const aggregation = await this.aggregate([
    {
      $match: {
        service: serviceId,
        staff: staffId,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        averageServiceQuality: { $avg: '$serviceRating.quality' },
        averageValueForMoney: { $avg: '$serviceRating.valueForMoney' },
        averageCleanliness: { $avg: '$serviceRating.cleanliness' },
        averageProfessionalism: { $avg: '$staffRating.professionalism' },
        averagePunctuality: { $avg: '$staffRating.punctuality' },
        averageCommunication: { $avg: '$staffRating.communication' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return aggregation[0] || {
    averageRating: 0,
    averageServiceQuality: 0,
    averageValueForMoney: 0,
    averageCleanliness: 0,
    averageProfessionalism: 0,
    averagePunctuality: 0,
    averageCommunication: 0,
    totalReviews: 0
  };
};

module.exports = mongoose.model('Review', reviewSchema);