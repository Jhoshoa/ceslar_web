/**
 * Application-wide constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Our Church';
export const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE || 'A place of faith, hope, and love';

// Navigation items
export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Ministries', path: '/ministries' },
  { label: 'Sermons', path: '/sermons' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/ourchurch',
  instagram: 'https://instagram.com/ourchurch',
  youtube: 'https://youtube.com/ourchurch',
  twitter: 'https://twitter.com/ourchurch',
};

// Service times
export const SERVICE_TIMES = [
  { day: 'Sunday', time: '10:00 AM', name: 'Morning Worship' },
  { day: 'Wednesday', time: '7:00 PM', name: 'Bible Study' },
];

// Church contact info
export const CHURCH_INFO = {
  name: 'Our Church',
  address: {
    street: '123 Church Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
  },
  phone: '(555) 123-4567',
  email: 'info@ourchurch.com',
  officeHours: 'Monday - Friday, 9:00 AM - 5:00 PM',
};

// Ministry types
export const MINISTRY_TYPES = {
  children: "Children's Ministry",
  youth: 'Youth Ministry',
  young_adults: 'Young Adults',
  men: "Men's Ministry",
  women: "Women's Ministry",
  seniors: 'Seniors Ministry',
  marriage_family: 'Marriage & Family',
  care_support: 'Care & Support',
  missions: 'Missions & Outreach',
  worship: 'Worship & Arts',
};

// Event types
export const EVENT_TYPES = {
  service: 'Worship Service',
  bible_study: 'Bible Study',
  prayer_meeting: 'Prayer Meeting',
  fellowship: 'Fellowship',
  conference: 'Conference',
  retreat: 'Retreat',
  outreach: 'Outreach',
  youth_event: 'Youth Event',
  children_event: "Children's Event",
  special: 'Special Event',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};
