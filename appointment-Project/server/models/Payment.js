const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Payment must be associated with an appointment']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must be associated with a user']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'INR',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['card', 'upi', 'netbanking', 'wallet']
  },
  transactionDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    cardNetwork: String,
    cardLastFour: String,
    upiId: String,
    bankName: String,
    walletProvider: String
  },
  refundDetails: [{
    amount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    refundId: String,
    processedAt: Date,
    notes: String
  }],
  metadata: {
    type: Map,
    of: String
  },
  notes: String,
  receiptNumber: {
    type: String,
    unique: true
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

// Generate receipt number before saving
paymentSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const lastPayment = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    const lastNumber = lastPayment ? parseInt(lastPayment.receiptNumber.split('-')[1]) : 0;
    this.receiptNumber = `RCPT-${(lastNumber + 1).toString().padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ 'transactionDetails.razorpayPaymentId': 1 });

module.exports = mongoose.model('Payment', paymentSchema);