const mongoose = require('mongoose');
const slugify = require('slugify');
const { GROUP_TYPES, DAYS_OF_WEEK } = require('../commons/constants');

const smallGroupSchema = new mongoose.Schema({
  // Church association
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    index: true
    // Not required initially for backwards compatibility
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
    enum: Object.values(GROUP_TYPES),
    required: true
  },
  description: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coLeaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['member', 'host', 'apprentice'], default: 'member' }
  }],
  schedule: {
    dayOfWeek: { type: String, enum: DAYS_OF_WEEK },
    time: String,
    frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'], default: 'weekly' }
  },
  location: {
    type: { type: String, enum: ['in-person', 'online', 'hybrid'], default: 'in-person' },
    address: String,
    city: String,
    zipCode: String,
    onlineUrl: String
  },
  demographics: {
    ageRange: String,
    gender: { type: String, enum: ['all', 'men', 'women'], default: 'all' },
    lifestage: String,
    hasChildcare: { type: Boolean, default: false }
  },
  capacity: {
    max: Number,
    current: { type: Number, default: 0 },
    acceptingMembers: { type: Boolean, default: true }
  },
  currentStudy: {
    title: String,
    description: String,
    startDate: Date,
    endDate: Date
  },
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
smallGroupSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Indexes
smallGroupSchema.index({ church: 1, isActive: 1 });
smallGroupSchema.index({ church: 1, type: 1 });

module.exports = mongoose.model('SmallGroup', smallGroupSchema);
