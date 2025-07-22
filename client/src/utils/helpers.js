// src/utils/helpers.js
import { useTranslation } from 'react-i18next';

// Hook to get localized text from multilingual objects
export const useLocalizedText = () => {
  const { i18n } = useTranslation();
  
  const getLocalizedText = (textObject, fallbackLang = 'en') => {
    if (typeof textObject === 'string') return textObject;
    if (Array.isArray(textObject)) return textObject; // If already an array, return as is
    if (!textObject || typeof textObject !== 'object') return '';
    
    const currentLang = i18n.language || 'en';
    return textObject[currentLang] || textObject[fallbackLang] || Object.values(textObject)[0] || '';
  };

  return { getLocalizedText, currentLanguage: i18n.language };
};