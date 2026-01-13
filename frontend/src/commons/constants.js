/**
 * Application-wide constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Cristo Es La Respuesta';
export const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE || 'Una familia de fe sirviendo a Dios y a la comunidad';

// Supported languages
export const LANGUAGES = {
  es: { code: 'es', name: 'Español', flag: '🇧🇴', region: 'Bolivia' },
  en: { code: 'en', name: 'English', flag: '🇺🇸', region: 'USA' },
  pt: { code: 'pt', name: 'Português', flag: '🇧🇷', region: 'Brasil' }
};

export const DEFAULT_LANGUAGE = 'es';

// Navigation items with i18n keys
export const NAV_ITEMS = [
  { label: 'Home', key: 'home', path: '/' },
  { label: 'About', key: 'about', path: '/about' },
  { label: 'Churches', key: 'churches', path: '/churches' },
  { label: 'Ministries', key: 'ministries', path: '/ministries' },
  { label: 'Sermons', key: 'sermons', path: '/sermons' },
  { label: 'Events', key: 'events', path: '/events' },
  { label: 'Contact', key: 'contact', path: '/contact' },
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/cristoeslarespuesta',
  youtube: 'https://youtube.com/CRISTOESLARESPUESTAOFICIAL',
  blog: 'https://difundiendolaverdad.blogspot.com',
};

// Service times (for headquarters)
export const SERVICE_TIMES = [
  { day: 'Sunday', time: '10:00 AM', name: 'Servicio Dominical' },
  { day: 'Sunday', time: '6:00 PM', name: 'Servicio Nocturno' },
  { day: 'Saturday', time: '6:00 PM', name: 'Estudio Bíblico' },
];

// Headquarters church info
export const CHURCH_INFO = {
  name: 'Sede Central Internacional',
  address: {
    street: 'Calle Chesterton esquina Walt Whitman',
    neighborhood: 'Barrio Los Tusequis',
    city: 'Santa Cruz de la Sierra',
    department: 'Santa Cruz',
    country: 'Bolivia',
  },
  phone: '(591) 3-3424802',
  email: 'julianoscristoeslarespuesta@gmail.com',
  foundedDate: '1969-09-24',
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
