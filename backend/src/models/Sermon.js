const mongoose = require('mongoose');
const slugify = require('slugify');
const { SERMON_CATEGORIES, SERMON_VISIBILITY } = require('../commons/constants');

const sermonSchema = new mongoose.Schema({
  // Church association
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    index: true
    // Not required initially for backwards compatibility
  },

  // Visibility across church network
  sermonVisibility: {
    type: String,
    enum: Object.values(SERMON_VISIBILITY),
    default: SERMON_VISIBILITY.NETWORK_WIDE // Sermons typically shared
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
    type: String
  },
  speaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakerName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: Object.values(SERMON_CATEGORIES),
    default: SERMON_CATEGORIES.SUNDAY_SERVICE
  },
  series: {
    name: String,
    part: Number,
    totalParts: Number
  },
  scripture: {
    book: String,
    chapter: String,
    verses: String,
    fullReference: String
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number // in minutes
  },
  media: {
    videoUrl: String,
    audioUrl: String,
    thumbnailUrl: String,
    youtubeId: String,
    vimeoId: String
  },
  resources: [{
    title: String,
    type: { type: String, enum: ['pdf', 'doc', 'link'] },
    url: String
  }],
  notes: {
    type: String // Rich text sermon notes
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  membersOnly: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate slug before saving
sermonSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Indexes
sermonSchema.index({ date: -1 });
sermonSchema.index({ title: 'text', description: 'text', 'scripture.fullReference': 'text' });
sermonSchema.index({ tags: 1 });
sermonSchema.index({ church: 1, date: -1 });
sermonSchema.index({ church: 1, sermonVisibility: 1 });

module.exports = mongoose.model('Sermon', sermonSchema);
