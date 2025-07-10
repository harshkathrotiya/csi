const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must have a recipient']
  },
  type: {
    type: String,
    required: true,
    enum: [
      'appointment_created',
      'appointment_updated',
      'appointment_cancelled',
      'appointment_reminder',
      'payment_received',
      'payment_failed',
      'refund_processed',
      'review_received',
      'waitlist_spot_available',
      'staff_assigned',
      'service_updated',
      'system_maintenance',
      'promotional'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  channel: {
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
    default: 'in_app'
  },
  data: {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    waitlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Waitlist'
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    additionalData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  action: {
    type: {
      type: String,
      enum: ['link', 'button', 'none'],
      default: 'none'
    },
    text: String,
    url: String
  },
  deliveryStatus: {
    sent: {
      type: Boolean,
      default: false
    },
    delivered: {
      type: Boolean,
      default: false
    },
    error: String,
    attempts: {
      type: Number,
      default: 0
    },
    lastAttempt: Date
  },
  readAt: Date,
  archivedAt: Date,
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Auto-delete after 30 days
  }
});

// Update timestamps when status changes
notificationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'read' && !this.readAt) {
      this.readAt = new Date();
    } else if (this.status === 'archived' && !this.archivedAt) {
      this.archivedAt = new Date();
    }
  }
  next();
});

// Set expiry date if not provided
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiry is 30 days from creation
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Indexes for efficient querying
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ 'data.appointment': 1 });
notificationSchema.index({ 'data.payment': 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(recipientId, notificationIds) {
  return this.updateMany(
    {
      recipient: recipientId,
      _id: { $in: notificationIds },
      status: 'unread'
    },
    {
      $set: {
        status: 'read',
        readAt: new Date()
      }
    }
  );
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = async function(recipientId) {
  return this.updateMany(
    {
      recipient: recipientId,
      status: 'unread'
    },
    {
      $set: {
        status: 'read',
        readAt: new Date()
      }
    }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);