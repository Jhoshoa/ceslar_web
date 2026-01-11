const mongoose = require('mongoose');
const slugify = require('slugify');
const { MINISTRY_TYPES } = require('../commons/constants');

const ministrySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Ministry', ministrySchema);
