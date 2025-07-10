const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide service name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide service description'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Please specify service duration in minutes'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Please specify service price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  staffMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model('User').findById(userId);
        return user && (user.role === 'staff' || user.role === 'admin');
      },
      message: 'Invalid staff member'
    }
  }],
  image: {
    type: String,
    default: null
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

// Update the updatedAt timestamp before saving
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);