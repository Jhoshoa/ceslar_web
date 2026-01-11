const mongoose = require('mongoose');
const {
  ROLES,
  SYSTEM_ROLES,
  CHURCH_ROLES,
  MEMBERSHIP_STATUS,
  LANGUAGES
} = require('../commons/constants');

// Church membership sub-schema
const churchMembershipSchema = new mongoose.Schema({
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    required: true
  },
  role: {
    type: String,
    enum: Object.values(CHURCH_ROLES),
    default: CHURCH_ROLES.VISITOR
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: Object.values(MEMBERSHIP_STATUS),
    default: MEMBERSHIP_STATUS.PENDING
  }
}, { _id: true });

// Registration answer sub-schema
const registrationAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },

  // Legacy role field (kept for backwards compatibility)
  // @deprecated Use systemRole and churchMemberships instead
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.VISITOR
  },

  // New system-wide role
  systemRole: {
    type: String,
    enum: Object.values(SYSTEM_ROLES),
    default: SYSTEM_ROLES.USER
  },

  // Primary church (user's main church)
  primaryChurch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  },

  // Church memberships (user can belong to multiple churches)
  churchMemberships: [churchMembershipSchema],

  // Registration questionnaire answers
  registrationAnswers: [registrationAnswerSchema],
  registrationCompleted: {
    type: Boolean,
    default: false
  },
  registrationCompletedAt: {
    type: Date
  },

  // Language preference
  preferredLanguage: {
    type: String,
    enum: Object.values(LANGUAGES),
    default: LANGUAGES.SPANISH
  },

  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Bolivia' }
  },

  // Enhanced location for geolocation features
  location: {
    country: String,
    department: String,
    province: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  dateOfBirth: {
    type: Date
  },
  memberSince: {
    type: Date
  },
  isMember: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  familyMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ministries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry'
  }],
  smallGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmallGroup'
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    newsletterSubscribed: { type: Boolean, default: true },
    showInDirectory: { type: Boolean, default: true }
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual to check if user is a system admin
userSchema.virtual('isSystemAdmin').get(function() {
  return this.systemRole === SYSTEM_ROLES.SYSTEM_ADMIN;
});

// Method to get user's role in a specific church
userSchema.methods.getRoleInChurch = function(churchId) {
  const membership = this.churchMemberships.find(
    m => m.church.toString() === churchId.toString() && m.status === MEMBERSHIP_STATUS.APPROVED
  );
  return membership ? membership.role : null;
};

// Method to check if user has a specific role in a church
userSchema.methods.hasRoleInChurch = function(churchId, roles) {
  const userRole = this.getRoleInChurch(churchId);
  if (!userRole) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(userRole);
};

// Method to check if user is admin or pastor in a church
userSchema.methods.isChurchAdmin = function(churchId) {
  return this.hasRoleInChurch(churchId, [CHURCH_ROLES.ADMIN, CHURCH_ROLES.PASTOR]);
};

// Method to check if user is a leader or above in a church
userSchema.methods.isChurchLeader = function(churchId) {
  return this.hasRoleInChurch(churchId, [CHURCH_ROLES.ADMIN, CHURCH_ROLES.PASTOR, CHURCH_ROLES.LEADER]);
};

// Method to check if user is a member of a church
userSchema.methods.isMemberOfChurch = function(churchId) {
  return this.churchMemberships.some(
    m => m.church.toString() === churchId.toString() && m.status === MEMBERSHIP_STATUS.APPROVED
  );
};

// Method to get all churches where user has a specific role
userSchema.methods.getChurchesByRole = function(roles) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return this.churchMemberships
    .filter(m => roleArray.includes(m.role) && m.status === MEMBERSHIP_STATUS.APPROVED)
    .map(m => m.church);
};

// Static method to find users by church
userSchema.statics.findByChurch = function(churchId, options = {}) {
  const query = {
    'churchMemberships.church': churchId,
    'churchMemberships.status': MEMBERSHIP_STATUS.APPROVED
  };

  if (options.role) {
    query['churchMemberships.role'] = options.role;
  }

  return this.find(query);
};

// Static method to find pending membership requests for a church
userSchema.statics.findPendingMemberships = function(churchId) {
  return this.find({
    'churchMemberships.church': churchId,
    'churchMemberships.status': MEMBERSHIP_STATUS.PENDING
  });
};

// Index for search
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Indexes for church memberships
userSchema.index({ primaryChurch: 1 });
userSchema.index({ 'churchMemberships.church': 1 });
userSchema.index({ 'churchMemberships.church': 1, 'churchMemberships.status': 1 });
userSchema.index({ 'churchMemberships.church': 1, 'churchMemberships.role': 1 });
userSchema.index({ systemRole: 1 });

module.exports = mongoose.model('User', userSchema);
