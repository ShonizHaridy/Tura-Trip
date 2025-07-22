// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from '../../public/locales/en/translation.json';
import itTranslation from '../../public/locales/it/translation.json';
import ruTranslation from '../../public/locales/ru/translation.json';
import deTranslation from '../../public/locales/de/translation.json';

const resources = {
  en: { translation: enTranslation },
  it: { translation: itTranslation },
  ru: { translation: ruTranslation },
  de: { translation: deTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;