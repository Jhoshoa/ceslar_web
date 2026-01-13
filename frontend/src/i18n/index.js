import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esChurches from '../locales/es/churches.json';
import esAuth from '../locales/es/auth.json';
import esDoctrine from '../locales/es/doctrine.json';

import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enChurches from '../locales/en/churches.json';
import enAuth from '../locales/en/auth.json';
import enDoctrine from '../locales/en/doctrine.json';

import ptCommon from '../locales/pt/common.json';
import ptHome from '../locales/pt/home.json';
import ptChurches from '../locales/pt/churches.json';
import ptAuth from '../locales/pt/auth.json';
import ptDoctrine from '../locales/pt/doctrine.json';

const resources = {
  es: {
    common: esCommon,
    home: esHome,
    churches: esChurches,
    auth: esAuth,
    doctrine: esDoctrine
  },
  en: {
    common: enCommon,
    home: enHome,
    churches: enChurches,
    auth: enAuth,
    doctrine: enDoctrine
  },
  pt: {
    common: ptCommon,
    home: ptHome,
    churches: ptChurches,
    auth: ptAuth,
    doctrine: ptDoctrine
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'home', 'churches', 'auth', 'doctrine'],

    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Keys to look for in localStorage
      lookupLocalStorage: 'i18nextLng',
      // Cache user language
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React already escapes values
    },

    react: {
      useSuspense: true
    }
  });

export default i18n;

// Helper to get supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇧🇴' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

// Helper to get current language info
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language || 'es';
  return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLang) || SUPPORTED_LANGUAGES[0];
};
