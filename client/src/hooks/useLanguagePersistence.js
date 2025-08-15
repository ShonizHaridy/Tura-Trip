// src/hooks/useLanguagePersistence.js - NEW FILE
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const useLanguagePersistence = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const supportedLanguages = ['en', 'ru', 'it', 'de'];
    
    // Skip admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Get language from URL
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    let urlLang = 'en';
    if (supportedLanguages.includes(firstSegment)) {
      urlLang = firstSegment;
    }

    // Sync i18n with URL language
    if (i18n.language !== urlLang) {
      console.log(`🔄 Syncing language: ${i18n.language} → ${urlLang}`);
      i18n.changeLanguage(urlLang);
    }
  }, [location.pathname, i18n]);

  return i18n.language;
};