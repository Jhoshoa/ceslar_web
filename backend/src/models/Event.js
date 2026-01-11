const mongoose = require('mongoose');
const slugify = require('slugify');
const { EVENT_TYPES, EVENT_STATUS, VISIBILITY_LEVELS } = require('../commons/constants');

const eventSchema = new mongoose.Schema({
  // Church association
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    index: true
    // Not required initially for backwards compatibility
  },

  // For events shared across multiple churches
  sharedWithChurches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  }],

  // Visibility level for event
  visibility: {
    type: String,
    enum: Object.values(VISIBILITY_LEVELS),
    default: VISIBILITY_LEVELS.CHURCH_ONLY
  },

  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  type: {
    type: String,
    enum: Object.values(EVENT_TYPES),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(EVENT_STATUS),
    default: EVENT_STATUS.DRAFT
  },
  featuredImage: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: {
    name: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    isOnline: { type: Boolean, default: false },
    onlineUrl: String
  },
  registration: {
    required: { type: Boolean, default: false },
    maxAttendees: Number,
    currentAttendees: { type: Number, default: 0 },
    deadline: Date,
    fee: { type: Number, default: 0 },
    waitlistEnabled: { type: Boolean, default: false }
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['registered', 'waitlisted', 'cancelled', 'attended'],
      default: 'registered'
    }
  }],
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contactEmail: String,
  contactPhone: String,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    interval: Number,
    daysOfWeek: [Number],
    endDate: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Index for querying
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ church: 1, startDate: 1, status: 1 });
eventSchema.index({ church: 1, visibility: 1 });
eventSchema.index({ sharedWithChurches: 1 });

module.exports = mongoose.model('Event', eventSchema);
