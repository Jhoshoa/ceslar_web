const mongoose = require('mongoose');
const { PRAYER_VISIBILITY } = require('../commons/constants');

const prayerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  request: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: Object.values(PRAYER_VISIBILITY),
    default: PRAYER_VISIBILITY.PUBLIC
  },
  category: {
    type: String,
    enum: ['health', 'family', 'finances', 'relationships', 'career', 'spiritual', 'other'],
    default: 'other'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  answeredDate: {
    type: Date
  },
  testimonyUpdate: {
    type: String
  },
  prayerCount: {
    type: Number,
    default: 0
  },
  prayedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prayedAt: { type: Date, default: Date.now }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for querying
prayerRequestSchema.index({ createdAt: -1 });
prayerRequestSchema.index({ visibility: 1, isApproved: 1 });

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
