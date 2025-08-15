// src/hooks/useLanguage.js - NEW FILE
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const supportedLanguages = ['en', 'ru', 'it', 'de'];

  const getCurrentLanguage = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (supportedLanguages.includes(firstSegment)) {
      return firstSegment;
    }
    return 'en'; // default
  };

  const changeLanguage = (newLang) => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    let cleanPath;
    if (supportedLanguages.includes(firstSegment)) {
      cleanPath = '/' + pathSegments.slice(1).join('/');
    } else {
      cleanPath = currentPath;
    }
    
    const newPath = newLang === 'en' 
      ? cleanPath || '/'
      : `/${newLang}${cleanPath}`;
    
    i18n.changeLanguage(newLang);
    navigate(newPath.replace(/\/+/g, '/'));
  };

  const getLocalizedPath = (path, lang = i18n.language) => {
    return lang === 'en' ? path : `/${lang}${path}`;
  };

  return {
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    getLocalizedPath,
    supportedLanguages
  };
};