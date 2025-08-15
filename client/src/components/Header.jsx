// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoLogoWhatsapp } from "react-icons/io";
import { SearchNormal1 } from 'iconsax-react';
// import { Link, useNavigate, useLocation } from "react-router-dom";
import { useNavigate, useLocation } from "../hooks/useSmartNavigation";
import { default as Link } from './SmartLink'
import TripAdvisor from "../assets/trip_advisor.svg?react";
import Logo from "../assets/logo-icon.svg?react";

import enFlag from "../assets/flags/en.png";
import ruFlag from "../assets/flags/ru.png";
import itFlag from "../assets/flags/it.png";
import deFlag from "../assets/flags/de.png";

import { useLocalizedText } from "../utils/helpers";
import { useLanguageContext } from '../contexts/LanguageContext'; 
import publicService from "../services/publicService";
import "./Header.css";

import { SlugHelper } from '../utils/slugHelper';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const { changeLanguage, currentLanguage, isChangingLanguage, DEFAULT_LANGUAGE } = useLanguageContext();
  const navigate = useNavigate();
  const location = useLocation();
  const languageRef = useRef(null);
  const exploreContainerRef = useRef(null);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [headerSuggestions, setHeaderSuggestions] = useState(null);
  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  const [headerSearchLoading, setHeaderSearchLoading] = useState(false);


  const headerSearchRef = useRef(null);

  const { getLocalizedText } = useLocalizedText();

  // Only home page should start transparent, all others start with white header
  const isHomePage = React.useMemo(() => {
    const pathname = location.pathname;
    
    // ✅ CHANGED: For Russian (default)
    if (currentLanguage === DEFAULT_LANGUAGE) {
      return pathname === '/';
    }
    
    // ✅ CHANGED: For other languages (including English)
    return pathname === `/${currentLanguage}` || pathname === `/${currentLanguage}/`;
  }, [location.pathname, currentLanguage, DEFAULT_LANGUAGE]);


  // Determine header background and colors
  const headerBg =
    scrolled || isExploreOpen || !isHomePage || isMobileMenuOpen
      ? `bg-white ${!isMobileMenuOpen ? 'shadow-lg' : ''}`
      : "bg-transparent";

  const textColor =
    scrolled || isExploreOpen || !isHomePage || isMobileMenuOpen
      ? "text-sea-green-500"
      : "text-white";

  // Dynamic fill colors for SVGs
  const logoFill =
    scrolled || isExploreOpen || !isHomePage || isMobileMenuOpen ? "#000000" : "#ffffff";

  const tripAdvisorFill =
    scrolled || isExploreOpen || !isHomePage ? "#000000" : "#ffffff";

  const navItems = [
    { key: "explore", label: t("nav.explore"), hasDropdown: true },
    { key: "about", label: t("nav.about"), href: "/about" },
    { key: "payment", label: t("nav.payment"), href: "/payment" },
    { key: "contact", label: t("nav.contact"), href: "/contact" },
  ];

  const languages = [
    { code: "en", name: "English", flag: enFlag },
    { code: "ru", name: "Русский", flag: ruFlag },  // Russian in Russian
    { code: "it", name: "Italiano", flag: itFlag }, // Italian in Italian  
    { code: "de", name: "Deutsch", flag: deFlag },  // German in German
  ];

  // const currentLanguage =
  //   languages.find((lang) => lang.code === i18n.language) || languages[0];
  const currentLanguageObj = languages.find((lang) => lang.code === currentLanguage) || languages[0];
    

  // ✅ FIXED: Fetch cities immediately on component mount
  useEffect(() => {
    fetchCitiesForHeader();
  }, []);

  // ✅ FIXED: Refetch when language changes (smooth update)
  useEffect(() => {
    fetchCitiesForHeader();
  }, [i18n.language]);

  const fetchCitiesForHeader = async () => {
    try {
      setLoading(true);
      console.log(`Fetching cities for language: ${i18n.language}`);
      
      const response = await publicService.getCitiesForHeader(i18n.language);
      if (response.success) {
        setDestinations(response.data);
        console.log(`✅ Cities loaded for ${i18n.language}:`, response.data);
      }
    } catch (error) {
      console.error('Error fetching cities for header:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
// useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (languageRef.current && !languageRef.current.contains(event.target)) {
//       setIsLanguageOpen(false);
//     }

//     // Only close explore dropdown if:
//     // 1. Not clicking inside desktop explore container AND
//     // 2. Not clicking inside mobile menu (when mobile menu is open)
//     const isInsideDesktopExplore = exploreContainerRef.current && exploreContainerRef.current.contains(event.target);
//     const isInsideMobileMenu = isMobileMenuOpen && event.target.closest('[data-mobile-menu]');
    
//     if (!isInsideDesktopExplore && !isInsideMobileMenu) {
//       setIsExploreOpen(false);
//     }

//     // ADD THIS: Header search outside click
//     if (headerSearchRef.current && !headerSearchRef.current.contains(event.target)) {
//       setShowHeaderSuggestions(false);
//     }
//   };

//   console.log("we are here ")

//     // document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isMobileMenuOpen]);

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

// In your Header.jsx - Replace the handleLanguageChange function
// In Header.jsx - ONLY change the handleLanguageChange function
// const handleLanguageChange = (langCode) => {
//   console.log(`🌐 Changing language from ${i18n.language} to ${langCode}`);
  
//   const currentPath = location.pathname;
//   let newPath;
  
//   // Remove any existing language prefix first
//   const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
  
//   if (langCode === 'en') {
//     newPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
//   } else {
//     newPath = pathWithoutLang === '/' ? `/${langCode}` : `/${langCode}${pathWithoutLang}`;
//   }
  
//   console.log(`🔄 Language switching from ${currentPath} to ${newPath}`);
  
//   // ✅ ONLY FOR LANGUAGE SWITCHING - use replaceState to avoid React state issues
//   window.history.replaceState(null, '', newPath);
//   i18n.changeLanguage(langCode);
//   setIsLanguageOpen(false);
// };

  const handleLanguageChange = (langCode) => {
    if (isChangingLanguage) return; // Prevent multiple clicks
    
    console.log(`🌐 Changing language from ${currentLanguage} to ${langCode}`);
    changeLanguage(langCode);
    setIsLanguageOpen(false);
  };


// Simple, reliable click outside handler
useEffect(() => {
  const handleClickOutside = (event) => {
    const target = event.target;
    
    // Language dropdown
    if (isLanguageOpen && languageRef.current && !languageRef.current.contains(target)) {
      setIsLanguageOpen(false);
    }
    
    // Search suggestions  
    if (showHeaderSuggestions && headerSearchRef.current && !headerSearchRef.current.contains(target)) {
      setShowHeaderSuggestions(false);
    }
    
    // Explore dropdown
    if (isExploreOpen) {
      const isInsideExplore = exploreContainerRef.current && exploreContainerRef.current.contains(target);
      const isInsideMobileMenu = isMobileMenuOpen && target.closest('[data-mobile-menu]');
      
      if (!isInsideExplore && !isInsideMobileMenu) {
        setIsExploreOpen(false);
      }
    }
  };

  // Only use click event - most reliable across all devices
  document.addEventListener("click", handleClickOutside);
  
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [isMobileMenuOpen, isExploreOpen, isLanguageOpen, showHeaderSuggestions]);

// // Enhanced click outside handler with proper mobile/desktop support
// useEffect(() => {
//   let isHandling = false;
//   let touchHandled = false;

//   const handleClickOutside = (event) => {
//     // Prevent duplicate handling from multiple event types
//     if (isHandling) return;
    
//     // For touch events, mark as handled and set a timeout to reset
//     if (event.type === 'touchstart') {
//       if (touchHandled) return;
//       touchHandled = true;
//       setTimeout(() => { touchHandled = false; }, 300);
//     }
    
//     // For mouse events, skip if touch was recently handled
//     if (event.type === 'mousedown' && touchHandled) return;
    
//     isHandling = true;
//     setTimeout(() => { isHandling = false; }, 10);

//     const clickedElement = event.target;
    
//     // Language dropdown handling
//     if (isLanguageOpen) {
//       const languageContainer = languageRef.current;
//       const isClickInsideLanguage = languageContainer && languageContainer.contains(clickedElement);
//       const isLanguageButton = clickedElement.closest('button[data-language-trigger]');
      
//       if (!isClickInsideLanguage && !isLanguageButton) {
//         console.log("[🌐 CLOSE] Closing language dropdown - clicked outside");
//         setIsLanguageOpen(false);
//       }
//     }

//     // Search suggestions handling
//     if (showHeaderSuggestions) {
//       const searchContainer = headerSearchRef.current;
//       const isClickInsideSearch = searchContainer && searchContainer.contains(clickedElement);
//       const isSearchInput = clickedElement.closest('input[data-search-input]');
      
//       if (!isClickInsideSearch && !isSearchInput) {
//         console.log("[🔍 CLOSE] Closing search suggestions - clicked outside");
//         setShowHeaderSuggestions(false);
//       }
//     }

//     // Explore dropdown handling
//     if (isExploreOpen) {
//       const isInsideDesktopExplore = exploreContainerRef.current && exploreContainerRef.current.contains(clickedElement);
//       const isInsideMobileMenu = isMobileMenuOpen && clickedElement.closest('[data-mobile-menu]');
//       const isExploreButton = clickedElement.closest('button[data-explore-trigger]');
      
//       if (!isInsideDesktopExplore && !isInsideMobileMenu && !isExploreButton) {
//         console.log("[🌍 CLOSE] Closing explore dropdown - clicked outside");
//         setIsExploreOpen(false);
//       }
//     }
//   };

//   // Use both mousedown and touchstart with proper handling
//   document.addEventListener("mousedown", handleClickOutside);
//   document.addEventListener("touchstart", handleClickOutside, { passive: true });
  
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//     document.removeEventListener("touchstart", handleClickOutside);
//   };
// }, [isMobileMenuOpen, isExploreOpen, isLanguageOpen, showHeaderSuggestions]);

// Handle mobile menu state changes - close search and explore when mobile menu closes
useEffect(() => {
  if (!isMobileMenuOpen) {
    // When mobile menu closes, also close search suggestions
    setShowHeaderSuggestions(false);
    setHeaderSearchQuery('');
    
    // If we're in mobile view, also close explore dropdown to prevent desktop dropdown appearing
    if (window.innerWidth < 1024) {
      setIsExploreOpen(false);
    }
  }
}, [isMobileMenuOpen]);

  // Handle destination click
  const handleDestinationClick = (citySlug) => {
    // const cityUrl = SlugHelper.createCityUrl(city.id, city.name);
    // console.log("city url for city: " , city)
    // console.log(cityUrl)
    navigate(`/destination/${citySlug}`);
    setIsExploreOpen(false);
    setIsMobileMenuOpen(false);
  };

    const handleHeaderSearch = async (query) => {
    if (!query || query.length < 2) {
      setHeaderSuggestions(null);
      setShowHeaderSuggestions(false);
      return;
  }

  try {
    setHeaderSearchLoading(true);
    const response = await publicService.getSearchSuggestions(query, i18n.language);
    if (response.success) {
      setHeaderSuggestions(response.data);
      setShowHeaderSuggestions(true);
    }
  } catch (error) {
    console.error('Error fetching header search suggestions:', error);
  } finally {
    setHeaderSearchLoading(false);
  }
};

const handleSearchFocus = () => {
  // Show suggestions if there's a query and we have results
  if (headerSearchQuery && headerSearchQuery.length >= 2 && headerSuggestions) {
    setShowHeaderSuggestions(true);
  }
  // Or trigger a new search if no results cached
  else if (headerSearchQuery && headerSearchQuery.length >= 2) {
    handleHeaderSearch(headerSearchQuery);
  }
};

const handleSearchBlur = () => {
  // Delay hiding suggestions to allow for clicks on suggestions
  setTimeout(() => {
    setShowHeaderSuggestions(false);
  }, 150);
};

const handleHeaderSearchSubmit = (e) => {
  if (e) e.preventDefault();
  if (headerSearchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(headerSearchQuery.trim())}`);
    setShowHeaderSuggestions(false);
    setHeaderSearchQuery('');
  }
};

const handleHeaderSuggestionClick = (suggestion) => {
  setShowHeaderSuggestions(false);
  setHeaderSearchQuery('');
  
  if (suggestion.type === 'city') {
    console.log("suggestion is:", suggestion)
    const citySlug = suggestion.slug;
    navigate(`/destination/${citySlug}`);
  } else if (suggestion.type === 'tour') {
    console.log("toudata", suggestion)
    const citySlug = suggestion.city_slug;
    navigate(`/destination/${citySlug}/${suggestion.id}`);
  } else if (suggestion.type === 'category') {
    navigate(`/search?category_id=${suggestion.id}`);
  }
};

const handleHeaderSearchKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleHeaderSearchSubmit(e);
  }
};


  // Close mobile menu when resizing to desktop (surely to avoid a change in view suddenly without menu close, messing up design)
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu if screen becomes desktop size (lg breakpoint = 1024px)
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setIsExploreOpen(false); // Also close explore for clean state
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);



const getNavButtonClasses = (isActive = false) => {
  const baseClasses = "px-1 py-2 lg:px-2 xl:px-4 xl:py-2 font-medium transition-all duration-200";
  
  if (scrolled || isExploreOpen || !isHomePage) {
    return `${baseClasses} text-sea-green-700 hover:text-sea-green-900 hover:border hover:border-black hover:rounded-lg`;
  } else {
    return `${baseClasses} text-white hover:text-sea-green-900 hover:bg-sea-green-100 hover:rounded-lg`;
  }
};

const getDropdownButtonClasses = () => {
  const baseClasses = "px-1 py-2 lg:px-2 xl:px-4 xl:py-2 font-medium transition-all duration-200 flex items-center space-x-1";
  
  if (scrolled || isExploreOpen || !isHomePage) {
    return `${baseClasses} text-sea-green-700 hover:text-sea-green-900 hover:border hover:border-black hover:rounded-lg`;
  } else {
    return `${baseClasses} text-white hover:text-sea-green-900 hover:bg-sea-green-100 hover:rounded-lg`;
  }
};

  const getTextSpanClasses = (isActive = false) => {
    if (scrolled || isExploreOpen || !isHomePage) {
      return isActive ? "border-b-2 border-sea-green-700 pb-1" : "";
    }
    return "";
  };

  return (
    <>
      {/* Wrap entire explore system in ref container */}
      <div ref={exploreContainerRef}>
        {/* Desktop Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
        >
        <nav className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 flex items-center justify-between min-h-[68px]">
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-6 flex-shrink-0">
            {/* Logo */}
            <div className="lg:h-17 justify-center p-1 w-auto flex-shrink-0">
              <Link to="/">
                <Logo
                  className="h-12 lg:h-15 w-auto transition-all duration-300"
                  style={{ fill: logoFill }}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0 xl:gap-1">
              {navItems.map((item) => (
                <div key={item.key} className="relative">
                  {item.hasDropdown ? (
                    <button 
                      data-explore-trigger="true" 
                      className={`${getDropdownButtonClasses()} text-sm xl:text-base`}
                      onClick={() => setIsExploreOpen(!isExploreOpen)}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <svg
                        className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`${getNavButtonClasses(location.pathname === item.href)} text-sm xl:text-base`}
                      onClick={() => setIsExploreOpen(false)} 
                    >
                      <span className={`whitespace-nowrap ${getTextSpanClasses(location.pathname === item.href)}`}>
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar - More flexible sizing */}
          {/* Enhanced Search Bar - More flexible sizing */}
          <div 
            className={`hidden h-[34px] lg:h-[38px] w-[180px] lg:w-[220px] xl:w-[303px] relative transition-all duration-300 flex-shrink-0 ${
              scrolled || isExploreOpen || !isHomePage 
                ? 'lg:flex opacity-100 visible pointer-events-auto' 
                : 'lg:flex opacity-0 invisible pointer-events-none'
            }`}
            ref={headerSearchRef}
          >
            <form 
              onSubmit={handleHeaderSearchSubmit}
              className="w-full px-3 lg:px-4 py-2 lg:py-3 flex justify-end items-center gap-2 border border-[#E8E7EA] rounded-md bg-white"
            >
              <input
                type="text"
                placeholder={scrolled || isExploreOpen || !isHomePage ? (window.innerWidth < 1200 ? "Search" : "Search") : "Search"}
                value={headerSearchQuery}
                onChange={(e) => {
                  setHeaderSearchQuery(e.target.value);
                  handleHeaderSearch(e.target.value);
                }}
                onFocus={() => headerSearchQuery && setShowHeaderSuggestions(true)}
                onKeyDown={handleHeaderSearchKeyDown}
                className="flex-1 text-[#8A8D95] font-roboto text-xs lg:text-sm xl:text-base font-normal outline-none bg-transparent placeholder:text-[#8A8D95] min-w-0"      
                tabIndex={scrolled || isExploreOpen || !isHomePage ? 0 : -1}
              />
              <button type="submit" className="flex-shrink-0">
                <SearchNormal1 
                  size="20" 
                  color="#8A8D95"
                  className="lg:w-6 lg:h-6"
                />
              </button>
            </form>

            {/* Header Search Suggestions */}
            {showHeaderSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-[60]">
                {headerSearchLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="text-gray-500 text-xs mt-2">{t('common.searching')}</p>
                  </div>
                ) : headerSuggestions && (headerSuggestions.cities?.length > 0 || headerSuggestions.tours?.length > 0 || headerSuggestions.categories?.length > 0) ? (
                  <>
                    {/* Cities */}
                    {headerSuggestions.cities?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          {t('common.destinations')}
                        </div>
                        {headerSuggestions.cities.map((city) => (
                          <button
                            key={`header-city-${city.id}`}
                            onClick={() => handleHeaderSuggestionClick(city)}
                            className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                          >
                            <img
                              src={city.image_url || '/placeholder.jpg'}
                              alt={city.name}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-xs">{city.name}</div>
                              <div className="text-xs text-gray-500">
                                {city.tours_count} {t('common.tours')}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Categories */}
                    {/* {headerSuggestions.categories?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          {t('common.categories')}
                        </div>
                        {headerSuggestions.categories.map((category) => (
                          <button
                            key={`header-category-${category.id}`}
                            onClick={() => handleHeaderSuggestionClick(category)}
                            className="w-full px-3 py-2 hover:bg-gray-50 text-gray-800 border-b border-gray-50 last:border-b-0"
                          >
                            <div className="font-medium text-xs">{category.name}</div>
                            <div className="text-xs text-gray-500">
                              {category.tours_count} {t('common.tours')}
                            </div>
                          </button>
                        ))}
                      </div>
                    )} */}

                    {/* Tours */}
                    {headerSuggestions.tours?.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          {t('common.tours')}
                        </div>
                        {headerSuggestions.tours.map((tour) => (
                          <button
                            key={`header-tour-${tour.id}`}
                            onClick={() => handleHeaderSuggestionClick(tour)}
                            className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                          >
                            <img
                              src={tour.image_url || '/placeholder.jpg'}
                              alt={tour.name}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-xs">{tour.name}</div>
                              <div className="text-xs text-gray-500">
                                {tour.city_name} • {tour.category_name}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Show More Results */}
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={() => {
                          setShowHeaderSuggestions(false);
                          navigate(`/search?q=${encodeURIComponent(headerSearchQuery)}`);
                          setHeaderSearchQuery('');
                        }}
                        className="w-full text-center text-xs text-teal-600 hover:text-teal-800 font-medium"
                      >
                        {t('common.showMoreResults')} →
                      </button>
                    </div>
                  </>
                ) : headerSearchQuery && (
                  <div className="px-3 py-2 text-gray-500 text-center text-xs">
                    {t('common.noResults')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Responsive but compact */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-2 xl:gap-4 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button 
                // data-language-trigger="true" 
                className={`${textColor} flex items-center space-x-1 xl:space-x-2 hover:opacity-80 px-1 xl:px-2 py-1 whitespace-nowrap`}
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <img
                  src={currentLanguageObj.flag}
                  alt={currentLanguageObj.name}
                  className="w-4 h-3 xl:w-5 xl:h-4 object-contain rounded-sm flex-shrink-0"
                />
                <span className="text-xs font-normal">
                  {currentLanguageObj.code.toUpperCase()}
                </span>
                <svg
                  className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Language Dropdown - keep same */}
              {isLanguageOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg overflow-hidden min-w-[120px] xl:min-w-[140px] z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className="w-full px-3 xl:px-4 py-2 xl:py-3 text-left hover:bg-gray-50 flex items-center space-x-2 xl:space-x-3 text-gray-800 transition-colors text-sm xl:text-base"
                      disabled={isChangingLanguage && currentLanguage.code === language.code}
                    >
                      <img
                        src={language.flag}
                        alt={language.name}
                        className="w-4 h-4 xl:w-5 xl:h-5 rounded-sm"
                      />
                      <span className="font-medium">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TripAdvisor Logo */}
            <div className="p-1 xl:p-2 flex-shrink-0">
              <a 
                href="https://www.tripadvisor.com/Profile/turatrip" 
                target="_blank" 
                rel="noopener noreferrer"
              >
              <TripAdvisor
                className="w-8 h-6 lg:w-10 lg:h-8 xl:w-14 xl:h-12 transition-all duration-300"
                style={{ color: tripAdvisorFill }}
              />
              </a>
            </div>

            {/* Book Now Button - More compact */}
            <button 
            onClick={() => window.open("https://wa.me/2001055957451", "_blank")}
            className="bg-[#2ba6a4] hover:bg-[#289795] text-white px-2 lg:px-3 xl:px-6 py-2 xl:py-3 rounded-[6px] font-medium transition-colors flex items-center space-x-1 xl:space-x-2 whitespace-nowrap flex-shrink-0 text-xs lg:text-sm xl:text-base cursor-pointer">
              <IoLogoWhatsapp className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
              <span className="hidden lg:inline">{t("nav.bookNow")}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${textColor} flex-shrink-0 self-center justify-center`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                if (isMobileMenuOpen) {
                  // Closing mobile menu - also close explore
                  setIsExploreOpen(false);
                }
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
          >
            {isMobileMenuOpen ? (
              // Close icon
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon  
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

          {/* ✅ Desktop Explore Dropdown - Updates smoothly during language change */}
          {isExploreOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
              <div className="container mx-auto px-4 lg:px-8 py-6">
                <div className="overflow-x-auto scrollbar-hide">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                        <p className="text-gray-500 text-sm">{t("common.loadingDots")}</p>
                      </div>
                    </div>
                  ) : destinations.length > 0 ? (
                    <div
                      className="flex space-x-6 pb-2 transition-all duration-300"
                      style={{ width: "max-content" }}
                    >
                      {destinations.map((destination) => (
                        <div
                          key={destination.id}
                          className="flex-shrink-0 flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
                          onClick={() => handleDestinationClick(destination.slug)}
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {/* ✅ FIXED: Use image_url instead of image */}
                            {destination.image_url ? (
                              <img
                                src={destination.image_url}
                                alt={destination.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            {/* Fallback div - will show if no image or image fails */}
                            <div 
                              className="w-full h-full bg-gradient-to-br from-[#2ba6a4] to-[#1a7a78] flex items-center justify-center"
                              style={{ display: destination.image_url ? 'none' : 'flex' }}
                            >
                              <span className="text-white font-medium text-xs">
                                {destination.name?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col min-w-0 max-w-[200px]">
                            <h4 className="font-semibold text-gray-800 text-sm whitespace-nowrap truncate">
                              {destination.name}
                            </h4>
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 break-words">
                              {destination.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No destinations available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

    {/* Mobile Menu Content - Appears Below Header */}
    {isMobileMenuOpen && (
      <div className="fixed top-[88px] left-0 right-0 bottom-0 z-[100] bg-white lg:hidden" data-mobile-menu>
        <div className="h-full flex flex-col">
          {/* Search Input */}
      {/* Enhanced Mobile Search Input */}
      <div className="px-5 pt-2 pb-6 flex-shrink-0">
        <form onSubmit={handleHeaderSearchSubmit}>
          <div className="flex h-[45px] px-4 py-3 justify-between items-center gap-2 border border-[#E8E7EA] rounded-md bg-white">
            <input 
              // data-search-input="true" 
              type="text"
              placeholder="Search"
              value={headerSearchQuery}
              onChange={(e) => {
                setHeaderSearchQuery(e.target.value);
                handleHeaderSearch(e.target.value);
              }} 
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={handleHeaderSearchKeyDown}
              className="flex-1 text-[#8A8D95] font-roboto text-base font-normal outline-none bg-transparent placeholder:text-[#8A8D95]"
            />
            <button type="submit">
              <SearchNormal1 size="24" color="#8A8D95" className="flex-shrink-0" />
            </button>
          </div>
        </form>

        {/* Mobile Search Suggestions */}
        {showHeaderSuggestions && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {headerSearchLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600 mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">{t('common.searching')}</p>
              </div>
            ) : headerSuggestions && (headerSuggestions.cities?.length > 0 || headerSuggestions.tours?.length > 0) ? (
              <div className="max-h-48 overflow-y-auto">
                {/* Cities */}
                {headerSuggestions.cities?.map((city) => (
                  <button
                    key={`mobile-city-${city.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mobile city suggestion clicked:", city);
                      handleHeaderSuggestionClick(city);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50"
                  >
                    <img
                      src={city.image_url || '/placeholder.jpg'}
                      alt={city.name}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-sm">{city.name}</div>
                      <div className="text-xs text-gray-500">{city.tours_count} {t('common.tours')}</div>
                    </div>
                  </button>
                ))}
                
                {/* Tours */}
                {headerSuggestions.tours?.map((tour) => (
                  <button
                    key={`mobile-tour-${tour.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mobile tour suggestion clicked:", tour);
                      handleHeaderSuggestionClick(tour);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50"
                  >
                    <img
                      src={tour.image_url || '/placeholder.jpg'}
                      alt={tour.name}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-sm">{tour.name}</div>
                      <div className="text-xs text-gray-500">{tour.city_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : headerSearchQuery && (
              <div className="px-4 py-3 text-gray-500 text-center text-sm">
                {t('common.noResults')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="flex flex-col gap-4">
          {/* Explore with dropdown */}
          <div>
          <button 
            // data-explore-trigger="true" 
            className="flex justify-between items-center w-full"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              console.log('🔄 Mobile explore clicked, current state:', isExploreOpen);
              setIsExploreOpen(!isExploreOpen);
            }}
          >
              <span className="text-[#0B101A] font-inter text-base font-medium leading-6">
                {t("nav.explore")}
              </span>
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  isExploreOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.9466 5.78192H7.79329H4.05329C3.41329 5.78192 3.09329 6.55525 3.54662 7.00859L6.99995 10.4619C7.55329 11.0153 8.45329 11.0153 9.00662 10.4619L10.32 9.14859L12.46 7.00859C12.9066 6.55525 12.5866 5.78192 11.9466 5.78192Z"
                  fill="#0B101A"
                />
              </svg>
            </button>

            {/* Mobile Explore dropdown */}
            {isExploreOpen && (
              <div className="mt-2 transition-all duration-300">
                {loading ? (
                  <div className="px-3 py-4 text-center text-gray-500">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                      <span className="text-sm">{t("common.loadingDots")}</span>
                    </div>
                  </div>
                ) : destinations.length > 0 ? (
                  <div className="space-y-2">
                    {destinations.slice(0, 3).map((destination) => (
                      <div
                        key={destination.id}
                        className="flex items-center gap-4 p-1 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🏃 Mobile city clicked:', destination.name);
                          handleDestinationClick(destination.slug);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <img
                          src={destination.image_url || "https://via.placeholder.com/86x54"}
                          alt={destination.name}
                          className="w-[86px] h-[54px] rounded-md object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/86x54";
                          }}
                        />
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="text-[#111827] font-roboto text-base font-medium leading-tight line-clamp-2">
                            {destination.name}
                          </div>
                          <div className="text-[#8A8D95] font-roboto text-sm font-normal leading-relaxed line-clamp-3">
                            {destination.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-gray-500">
                    No destinations available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other nav items */}
          {navItems.slice(1).map((item) => (
            // <div key={item.key} className="border-b border-gray-100 last:border-b-0">
            <div key={item.key}>
              <Link
                to={item.href}
                className="flex items-center w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-[#0B101A] font-roboto text-base font-medium leading-tight">
                  {item.label}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 border-t border-[#F9FAFB] px-5 py-6">
        <div className="flex flex-col gap-6">
          {/* Language selector and TripAdvisor */}
          <div className="flex justify-between items-center">
            {/* Language Menu */}
            <div className="relative">
              <button 
                data-language-trigger="true" 
                className="flex items-center gap-2 px-2 py-2"
                onClick={(e) => {
                e.stopPropagation();
                console.log("[🌐 TOGGLE] Language dropdown toggled");
                setIsLanguageOpen(!isLanguageOpen);
                }}
              >
                <img
                  src={currentLanguageObj.flag}
                  alt={currentLanguageObj.name}
                  className="w-6 h-5 object-contain rounded-sm flex-shrink-0"
                />
                <span className="text-[#090127] font-roboto text-sm font-normal leading-[18px]">
                  {currentLanguageObj.code.toUpperCase()}
                </span>
                <svg 
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                    isLanguageOpen ? 'rotate-180' : ''
                  }`} 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path
                    d="M11.9466 5.78192H7.79329H4.05329C3.41329 5.78192 3.09329 6.55525 3.54662 7.00859L6.99995 10.4619C7.55329 11.0153 8.45329 11.0153 9.00662 10.4619L10.32 9.14859L12.46 7.00859C12.9066 6.55525 12.5866 5.78192 11.9466 5.78192Z"
                    fill="#0B101A"
                  />
                </svg>
              </button>
              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg overflow-hidden z-110 min-w-[140px] border border-gray-200">
                  <div className="py-2">
                    {languages.map((language, index) => (
                      <button  
                        key={language.code}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // // Also stop immediate propagation for other listeners
                          // // e.nativeEvent?.stopImmediatePropagation?.();
                          // handleLanguageChange(language.code);
                          console.log("[🌐 CLICK] Language item clicked:", language.code);
                          handleLanguageChange(language.code);
                          console.log("[🌐 DONE] handleLanguageChange called");
                          setIsLanguageOpen(false);
                          // setIsMobileMenuOpen(false); // if needed
                        }}
                        className={`flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 transition-colors text-left ${
                          index !== languages.length - 1 ? 'border-b border-[#E6E6E8]' : ''
                        } ${currentLanguage.code === language.code ? 'bg-gray-50' : ''}`}
                      >
                        <img
                          src={language.flag}
                          alt={language.name}
                          className="w-6 h-5 object-contain rounded-sm flex-shrink-0"
                        />
                        <span className="text-[#010818] font-roboto text-sm font-normal">
                          {language.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* TripAdvisor */}
            <div className="flex items-center justify-center">
              <TripAdvisor
                className="w-14 h-12 flex-shrink-0"
                style={{ color: "#000000" }}
              />
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={() => window.open("https://wa.me/2001055957451", "_blank")}
            className="flex px-6 py-3 justify-center items-center gap-2 w-full rounded-md bg-[#1F7674] hover:bg-[#1a6564] transition-colors min-h-[48px] cursor-pointer"
          >
            <IoLogoWhatsapp className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white font-roboto text-lg font-semibold leading-tight">
              {t("nav.bookNow")}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Header;