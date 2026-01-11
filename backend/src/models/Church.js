const mongoose = require('mongoose');
const slugify = require('slugify');
const {
  CHURCH_LEVELS,
  CHURCH_STATUS,
  LEADERSHIP_ROLES,
  SERVICE_TYPES,
  LANGUAGES
} = require('../commons/constants');

const serviceScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(SERVICE_TYPES),
    required: true
  },
  typeName: {
    type: String // Custom name for 'other' type
  },
  startTime: {
    type: String, // HH:mm format
    required: true
  },
  endTime: {
    type: String // HH:mm format
  },
  description: {
    es: String,
    en: String,
    pt: String
  }
}, { _id: false });

const leadershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: Object.values(LEADERSHIP_ROLES),
    required: true
  },
  title: {
    type: String // Custom title like "Pastor Principal", "Anciano"
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: true });

const churchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },

  // Hierarchy
  parentChurch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    default: null
  },
  level: {
    type: String,
    enum: Object.values(CHURCH_LEVELS),
    required: true,
    default: CHURCH_LEVELS.LOCAL
  },
  isHeadquarters: {
    type: Boolean,
    default: false
  },
  region: {
    type: String // For grouping (e.g., "South America")
  },

  // Location
  country: {
    type: String,
    required: true,
    index: true
  },
  department: {
    type: String, // State/Region
    index: true
  },
  province: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },

  // Contact
  phone: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  website: {
    type: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    whatsapp: String,
    tiktok: String,
    twitter: String,
    blog: String,
    zoom: {
      meetingId: String,
      password: String,
      link: String
    }
  },

  // Media (Cloudinary URLs)
  logo: {
    type: String
  },
  coverImage: {
    type: String
  },
  gallery: [{
    url: String,
    caption: {
      es: String,
      en: String,
      pt: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Schedule
  serviceSchedule: [serviceScheduleSchema],

  // Leadership (multiple admins/pastors)
  leadership: [leadershipSchema],

  // Founding info
  foundedDate: {
    type: Date
  },
  foundedBy: {
    type: String
  },
  history: {
    es: String,
    en: String,
    pt: String
  },

  // Description
  description: {
    es: String,
    en: String,
    pt: String
  },
  shortDescription: {
    es: { type: String, maxlength: 200 },
    en: { type: String, maxlength: 200 },
    pt: { type: String, maxlength: 200 }
  },

  // Status
  status: {
    type: String,
    enum: Object.values(CHURCH_STATUS),
    default: CHURCH_STATUS.PENDING
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Statistics (cached, updated periodically)
  stats: {
    memberCount: { type: Number, default: 0 },
    eventCount: { type: Number, default: 0 },
    sermonCount: { type: Number, default: 0 }
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  settings: {
    defaultLanguage: {
      type: String,
      enum: Object.values(LANGUAGES),
      default: LANGUAGES.SPANISH
    },
    timezone: {
      type: String,
      default: 'America/La_Paz'
    },
    allowMemberRegistration: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug before saving
churchSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    // Add country and department to make slug more unique
    const locationPart = [this.country, this.department, this.city]
      .filter(Boolean)
      .map(s => slugify(s, { lower: true, strict: true }))
      .join('-');
    this.slug = locationPart ? `${baseSlug}-${locationPart}` : baseSlug;
  }
  next();
});

// Virtual for full address
churchSchema.virtual('fullAddress').get(function() {
  const parts = [this.address, this.city, this.province, this.department, this.country];
  return parts.filter(Boolean).join(', ');
});

// Virtual for child churches
churchSchema.virtual('childChurches', {
  ref: 'Church',
  localField: '_id',
  foreignField: 'parentChurch'
});

// Static method to get church hierarchy
churchSchema.statics.getHierarchy = async function(churchId) {
  const church = await this.findById(churchId);
  if (!church) return null;

  const hierarchy = [church];
  let current = church;

  while (current.parentChurch) {
    current = await this.findById(current.parentChurch);
    if (current) hierarchy.unshift(current);
  }

  return hierarchy;
};

// Static method to get churches by country
churchSchema.statics.getByCountry = function(country) {
  return this.find({ country, status: CHURCH_STATUS.ACTIVE })
    .sort({ department: 1, city: 1, name: 1 });
};

// Static method to get churches grouped by country and department
churchSchema.statics.getGroupedByLocation = async function() {
  return this.aggregate([
    { $match: { status: CHURCH_STATUS.ACTIVE } },
    {
      $group: {
        _id: { country: '$country', department: '$department' },
        churches: {
          $push: {
            _id: '$_id',
            name: '$name',
            slug: '$slug',
            city: '$city',
            level: '$level'
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.country',
        departments: {
          $push: {
            department: '$_id.department',
            churches: '$churches',
            count: '$count'
          }
        },
        totalCount: { $sum: '$count' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Indexes
churchSchema.index({ slug: 1 }, { unique: true });
churchSchema.index({ country: 1, department: 1, status: 1 });
churchSchema.index({ parentChurch: 1 });
churchSchema.index({ level: 1 });
churchSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
churchSchema.index({ name: 'text', 'description.es': 'text', 'description.en': 'text' });

module.exports = mongoose.model('Church', churchSchema);
