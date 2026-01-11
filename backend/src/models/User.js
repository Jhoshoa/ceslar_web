const mongoose = require('mongoose');
const { ROLES } = require('../commons/constants');

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
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.VISITOR
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
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

// Index for search
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

module.exports = mongoose.model('User', userSchema);
