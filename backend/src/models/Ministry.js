const mongoose = require('mongoose');
const slugify = require('slugify');
const { MINISTRY_TYPES, MINISTRY_SCOPE } = require('../commons/constants');

const ministrySchema = new mongoose.Schema({
  // Church association
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    index: true
    // Not required initially for backwards compatibility
  },

  // Ministry scope (local to church or wider)
  scope: {
    type: String,
    enum: Object.values(MINISTRY_SCOPE),
    default: MINISTRY_SCOPE.LOCAL
  },

  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: Object.values(MINISTRY_TYPES),
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  featuredImage: {
    type: String
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  },
  meetingSchedule: {
    day: String,
    time: String,
    frequency: String,
    location: String
  },
  ageRange: {
    min: Number,
    max: Number,
    description: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  volunteers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    joinedAt: { type: Date, default: Date.now }
  }],
  resources: [{
    title: String,
    description: String,
    url: String,
    type: { type: String, enum: ['link', 'pdf', 'video'] }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
ministrySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Indexes
ministrySchema.index({ church: 1, isActive: 1 });
ministrySchema.index({ church: 1, scope: 1 });

module.exports = mongoose.model('Ministry', ministrySchema);
