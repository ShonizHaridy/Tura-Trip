// src/components/MetaTags.jsx - FINAL VERSION
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

const MetaTags = ({ 
  title, 
  description, 
  keywords, 
  ogImage = '/images/logo.png',
  canonical,
  noindex = false 
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { currentLanguage, DEFAULT_LANGUAGE } = useLanguageContext();
  
  const baseUrl = 'https://turatrip.com';
  const currentPath = location.pathname;
  
  // Remove language from path for canonical and alternates
  const pathWithoutLang = React.useMemo(() => {
    if (currentLanguage === DEFAULT_LANGUAGE) {
      return currentPath; // Russian (default) has no prefix
    }
    // Remove language prefix for other languages
    return currentPath.replace(new RegExp(`^/${currentLanguage}`), '') || '/';
  }, [currentPath, currentLanguage, DEFAULT_LANGUAGE]);
  
  // Generate proper URLs for each language
  const getLanguageUrl = (lang) => {
    if (lang === DEFAULT_LANGUAGE) {
      return `${baseUrl}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    }
    return `${baseUrl}/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  };

  // Get proper locale for Open Graph
  const getOgLocale = (lang) => {
    const locales = {
      'en': 'en_US',
      'ru': 'ru_RU', 
      'it': 'it_IT',
      'de': 'de_DE'
    };
    return locales[lang] || 'ru_RU';
  };

  return (
    <>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="language" content={currentLanguage} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:url" content={getLanguageUrl(currentLanguage)} />
      <meta property="og:locale" content={getOgLocale(currentLanguage)} />
      <meta property="og:site_name" content="Tura Trip" />
      
      {/* Twitter */}
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:url" content={getLanguageUrl(currentLanguage)} /> */}
      
      {/* Canonical */}
      <link rel="canonical" href={canonical || getLanguageUrl(currentLanguage)} />
      
      {/* Language alternatives - Russian is default (no prefix) */}
      <link rel="alternate" hreflang="ru" href={getLanguageUrl('ru')} />
      <link rel="alternate" hreflang="en" href={getLanguageUrl('en')} />
      <link rel="alternate" hreflang="it" href={getLanguageUrl('it')} />
      <link rel="alternate" hreflang="de" href={getLanguageUrl('de')} />
      <link rel="alternate" hreflang="x-default" href={getLanguageUrl(DEFAULT_LANGUAGE)} />
    </>
  );
};

export default MetaTags;