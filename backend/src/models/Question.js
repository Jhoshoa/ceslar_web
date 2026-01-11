const mongoose = require('mongoose');
const {
  QUESTION_TYPES,
  QUESTION_AUDIENCE,
  QUESTION_SCOPE,
  LANGUAGES
} = require('../commons/constants');

// Multilingual text schema helper
const multilingualText = {
  es: { type: String },
  en: { type: String },
  pt: { type: String }
};

// Question Category Schema
const questionCategorySchema = new mongoose.Schema({
  name: {
    es: { type: String, required: true },
    en: { type: String },
    pt: { type: String }
  },
  description: multilingualText,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

questionCategorySchema.index({ order: 1 });
questionCategorySchema.index({ isActive: 1 });

const QuestionCategory = mongoose.model('QuestionCategory', questionCategorySchema);

// Question Option Schema (for select, multiselect, radio)
const questionOptionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  labels: {
    es: { type: String, required: true },
    en: { type: String },
    pt: { type: String }
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Question Schema
const questionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionCategory'
  },

  // Question text (multilingual)
  questionText: {
    es: { type: String, required: true },
    en: { type: String },
    pt: { type: String }
  },

  // Question type
  questionType: {
    type: String,
    enum: Object.values(QUESTION_TYPES),
    required: true,
    default: QUESTION_TYPES.TEXT
  },

  // Options for select, multiselect, radio
  options: [questionOptionSchema],

  // Validation rules
  validation: {
    isRequired: {
      type: Boolean,
      default: false
    },
    minLength: {
      type: Number
    },
    maxLength: {
      type: Number
    },
    min: {
      type: Number // For number type
    },
    max: {
      type: Number // For number type
    },
    regex: {
      type: String // Custom regex pattern
    },
    regexMessage: multilingualText // Error message if regex fails
  },

  // Display options
  placeholder: multilingualText,
  helpText: multilingualText,
  order: {
    type: Number,
    default: 0
  },

  // Targeting
  targetAudience: {
    type: String,
    enum: Object.values(QUESTION_AUDIENCE),
    default: QUESTION_AUDIENCE.ALL
  },

  // Scope: global or church-specific
  scope: {
    type: String,
    enum: Object.values(QUESTION_SCOPE),
    default: QUESTION_SCOPE.GLOBAL
  },

  // If church_specific, which churches see this question
  churches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  }],

  // Conditional display (show only if another question has specific answer)
  conditionalDisplay: {
    dependsOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    showWhenValue: mongoose.Schema.Types.Mixed // Value that triggers display
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Get localized question text
questionSchema.methods.getLocalizedText = function(field, lang = 'es') {
  const fieldValue = this[field];
  if (!fieldValue) return '';
  return fieldValue[lang] || fieldValue.es || '';
};

// Get all options localized
questionSchema.methods.getLocalizedOptions = function(lang = 'es') {
  return this.options.map(opt => ({
    value: opt.value,
    label: opt.labels[lang] || opt.labels.es || opt.value
  })).sort((a, b) => a.order - b.order);
};

// Static method to get questions for a specific church
questionSchema.statics.getForChurch = function(churchId, options = {}) {
  const query = {
    isActive: true,
    $or: [
      { scope: QUESTION_SCOPE.GLOBAL },
      { scope: QUESTION_SCOPE.CHURCH_SPECIFIC, churches: churchId }
    ]
  };

  if (options.audience) {
    query.$or = [
      { targetAudience: QUESTION_AUDIENCE.ALL },
      { targetAudience: options.audience }
    ];
  }

  if (options.category) {
    query.category = options.category;
  }

  return this.find(query)
    .populate('category')
    .sort({ 'category.order': 1, order: 1 });
};

// Static method to get all active global questions
questionSchema.statics.getGlobalQuestions = function() {
  return this.find({
    isActive: true,
    scope: QUESTION_SCOPE.GLOBAL
  })
    .populate('category')
    .sort({ 'category.order': 1, order: 1 });
};

// Indexes
questionSchema.index({ category: 1, order: 1 });
questionSchema.index({ isActive: 1 });
questionSchema.index({ scope: 1 });
questionSchema.index({ churches: 1 });
questionSchema.index({ targetAudience: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question, QuestionCategory };
