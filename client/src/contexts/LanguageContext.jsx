// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const supportedLanguages = ['en', 'ru', 'it', 'de'];
  const DEFAULT_LANGUAGE = 'ru'; // ✅ CHANGED: Russian as default

  // Get current language from URL
  const getCurrentLanguageFromUrl = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (supportedLanguages.includes(firstSegment)) {
      return firstSegment;
    }
    return DEFAULT_LANGUAGE; // ✅ CHANGED: Default to Russian
  };

  // Change language and update URL
  const changeLanguage = (newLang) => {
    if (isChangingLanguage) return;
    
    setIsChangingLanguage(true);
    
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    // Remove existing language prefix if present
    let cleanPath;
    if (supportedLanguages.includes(firstSegment)) {
      cleanPath = '/' + pathSegments.slice(1).join('/');
    } else {
      cleanPath = currentPath;
    }
    
    // ✅ CHANGED: Russian gets no prefix, others get prefixes
    const newPath = newLang === DEFAULT_LANGUAGE 
      ? cleanPath || '/' 
      : `/${newLang}${cleanPath}`;
    
    // Update i18n language
    i18n.changeLanguage(newLang).then(() => {
      navigate(newPath + currentSearch, { replace: true });
      setIsChangingLanguage(false);
    });
  };

  // Sync i18n with URL on mount and location change
  useEffect(() => {
    if (isChangingLanguage) return;
    
    const urlLang = getCurrentLanguageFromUrl();
    
    // Skip admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }
    
    if (i18n.language !== urlLang) {
      i18n.changeLanguage(urlLang);
    }
  }, [location.pathname, i18n, isChangingLanguage]);

  const value = {
    currentLanguage: getCurrentLanguageFromUrl(),
    changeLanguage,
    supportedLanguages,
    isChangingLanguage,
    DEFAULT_LANGUAGE // ✅ ADDED: Export default language
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};