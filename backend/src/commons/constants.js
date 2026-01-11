/**
 * Application-wide constants
 */

module.exports = {
  // Legacy user roles (kept for backwards compatibility)
  // @deprecated Use SYSTEM_ROLES and CHURCH_ROLES instead
  ROLES: {
    ADMIN: 'admin',
    PASTOR: 'pastor',
    STAFF: 'staff',
    LEADER: 'leader',
    MEMBER: 'member',
    VISITOR: 'visitor'
  },

  // System-wide roles (not church-specific)
  SYSTEM_ROLES: {
    SYSTEM_ADMIN: 'system_admin',
    USER: 'user'
  },

  // Church-specific roles (per church membership)
  CHURCH_ROLES: {
    ADMIN: 'admin',
    PASTOR: 'pastor',
    LEADER: 'leader',
    MEMBER: 'member',
    VISITOR: 'visitor'
  },

  // Church hierarchy levels
  CHURCH_LEVELS: {
    HEADQUARTERS: 'headquarters',
    COUNTRY: 'country',
    DEPARTMENT: 'department',
    PROVINCE: 'province',
    LOCAL: 'local'
  },

  // Church status
  CHURCH_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
  },

  // Membership status
  MEMBERSHIP_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended'
  },

  // Church leadership roles
  LEADERSHIP_ROLES: {
    SENIOR_PASTOR: 'senior_pastor',
    PASTOR: 'pastor',
    ELDER: 'elder',
    DEACON: 'deacon',
    ADMIN: 'admin'
  },

  // Supported languages
  LANGUAGES: {
    SPANISH: 'es',
    ENGLISH: 'en',
    PORTUGUESE: 'pt'
  },

  // Content visibility levels
  VISIBILITY_LEVELS: {
    CHURCH_ONLY: 'church_only',
    DEPARTMENT: 'department',
    COUNTRY: 'country',
    GLOBAL: 'global'
  },

  // Sermon visibility
  SERMON_VISIBILITY: {
    CHURCH_ONLY: 'church_only',
    NETWORK_WIDE: 'network_wide'
  },

  // Question types for dynamic forms
  QUESTION_TYPES: {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    MULTISELECT: 'multiselect',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    DATE: 'date',
    NUMBER: 'number',
    EMAIL: 'email',
    PHONE: 'phone'
  },

  // Question target audience
  QUESTION_AUDIENCE: {
    ALL: 'all',
    NEW_VISITORS: 'new_visitors',
    RETURNING: 'returning',
    MEMBERS: 'members'
  },

  // Question scope
  QUESTION_SCOPE: {
    GLOBAL: 'global',
    CHURCH_SPECIFIC: 'church_specific'
  },

  // Ministry scope
  MINISTRY_SCOPE: {
    LOCAL: 'local',
    DEPARTMENT: 'department',
    COUNTRY: 'country',
    GLOBAL: 'global'
  },

  // Service schedule types
  SERVICE_TYPES: {
    SUNDAY_SERVICE: 'sunday_service',
    BIBLE_STUDY: 'bible_study',
    PRAYER: 'prayer',
    YOUTH: 'youth',
    CHILDREN: 'children',
    WOMEN: 'women',
    MEN: 'men',
    OTHER: 'other'
  },

  // Ministry types
  MINISTRY_TYPES: {
    CHILDREN: 'children',
    YOUTH: 'youth',
    YOUNG_ADULTS: 'young_adults',
    MEN: 'men',
    WOMEN: 'women',
    SENIORS: 'seniors',
    MARRIAGE_FAMILY: 'marriage_family',
    CARE_SUPPORT: 'care_support',
    MISSIONS: 'missions',
    WORSHIP: 'worship'
  },

  // Event types
  EVENT_TYPES: {
    SERVICE: 'service',
    BIBLE_STUDY: 'bible_study',
    PRAYER_MEETING: 'prayer_meeting',
    FELLOWSHIP: 'fellowship',
    CONFERENCE: 'conference',
    RETREAT: 'retreat',
    OUTREACH: 'outreach',
    YOUTH_EVENT: 'youth_event',
    CHILDREN_EVENT: 'children_event',
    SPECIAL: 'special'
  },

  // Event status
  EVENT_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },

  // Sermon categories
  SERMON_CATEGORIES: {
    SUNDAY_SERVICE: 'sunday_service',
    WEDNESDAY_BIBLE_STUDY: 'wednesday_bible_study',
    SPECIAL_SERVICE: 'special_service',
    CONFERENCE: 'conference',
    GUEST_SPEAKER: 'guest_speaker'
  },

  // Prayer request visibility
  PRAYER_VISIBILITY: {
    PUBLIC: 'public',
    MEMBERS_ONLY: 'members_only',
    PRIVATE: 'private',
    PRAYER_TEAM: 'prayer_team'
  },

  // Giving fund types
  GIVING_FUNDS: {
    TITHE: 'tithe',
    OFFERING: 'offering',
    MISSIONS: 'missions',
    BUILDING: 'building',
    BENEVOLENCE: 'benevolence',
    SPECIAL: 'special'
  },

  // Small group types
  GROUP_TYPES: {
    BIBLE_STUDY: 'bible_study',
    PRAYER: 'prayer',
    FELLOWSHIP: 'fellowship',
    SUPPORT: 'support',
    SERVICE: 'service',
    DISCIPLESHIP: 'discipleship'
  },

  // Volunteer status
  VOLUNTEER_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ON_LEAVE: 'on_leave'
  },

  // Days of the week
  DAYS_OF_WEEK: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],

  // Regular expressions
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s-()]{10,}$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    SHORT: 60,           // 1 minute
    MEDIUM: 300,         // 5 minutes
    LONG: 3600,          // 1 hour
    DAY: 86400           // 24 hours
  }
};
