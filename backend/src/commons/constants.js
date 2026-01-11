/**
 * Application-wide constants
 */

module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    PASTOR: 'pastor',
    STAFF: 'staff',
    LEADER: 'leader',
    MEMBER: 'member',
    VISITOR: 'visitor'
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
