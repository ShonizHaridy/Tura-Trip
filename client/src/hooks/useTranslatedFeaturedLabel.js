// src/utils/helpers.js
import { useTranslation } from 'react-i18next';

// Hook to get localized text from multilingual objects
export const useLocalizedText = () => {
  const { i18n } = useTranslation();
  
  const getLocalizedText = (textObject, fallbackLang = 'en') => {
    if (typeof textObject === 'string') return textObject;
    if (Array.isArray(textObject)) return textObject;
    if (!textObject || typeof textObject !== 'object') return '';
    
    const currentLang = i18n.language || 'en';
    return textObject[currentLang] || textObject[fallbackLang] || Object.values(textObject)[0] || '';
  };
  
  return { getLocalizedText, currentLanguage: i18n.language };
};

// Hook to get translated featured labels
export const useTranslatedFeaturedLabel = () => {
  const { t } = useTranslation();
  
  const getTranslatedFeaturedLabel = (featuredTag) => {
    if (!featuredTag) return t('common.featured');
    
    // Convert the tag to lowercase and try to find translation
    const tagKey = featuredTag.toLowerCase().replace(/\s+/g, '');
    const translationKey = `common.${tagKey}`;
    
    // Try to get translation, fallback to original tag if not found
    const translated = t(translationKey);
    return translated !== translationKey ? translated : featuredTag;
  };
  
  return getTranslatedFeaturedLabel;
};