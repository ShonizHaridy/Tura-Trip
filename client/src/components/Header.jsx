// src/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoLogoWhatsapp } from "react-icons/io";
import { SearchNormal1 } from 'iconsax-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import TripAdvisor from "../assets/trip_advisor.svg?react";
import Logo from "../assets/logo-icon.svg?react";

import enFlag from "../assets/flags/en.png";
import ruFlag from "../assets/flags/ru.png";
import itFlag from "../assets/flags/it.png";
import deFlag from "../assets/flags/de.png";

import { useLocalizedText } from "../utils/helpers";
import publicService from "../services/publicService";
import "./Header.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const languageRef = useRef(null);
  const exploreContainerRef = useRef(null);

  const { getLocalizedText } = useLocalizedText();

  // Only home page should start transparent, all others start with white header
  const isHomePage = location.pathname === "/";

  // Determine header background and colors
  const headerBg =
    scrolled || isExploreOpen || !isHomePage
      ? "bg-white shadow-lg"
      : "bg-transparent";

  const textColor =
    scrolled || isExploreOpen || !isHomePage
      ? "text-sea-green-500"
      : "text-white";

  // Dynamic fill colors for SVGs
  const logoFill =
    scrolled || isExploreOpen || !isHomePage ? "#000000" : "#ffffff";

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
    { code: "ru", name: "Russian", flag: ruFlag },
    { code: "it", name: "Italian", flag: itFlag },
    { code: "de", name: "German", flag: deFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }

      if (
        exploreContainerRef.current &&
        !exploreContainerRef.current.contains(event.target)
      ) {
        setIsExploreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    console.log(`🌐 Changing language from ${i18n.language} to ${langCode}`);
    i18n.changeLanguage(langCode);
    setIsLanguageOpen(false);
    // ✅ Data will be refetched automatically by useEffect above
    // ✅ Explore dropdown stays open and updates smoothly
  };

  // Handle destination click
  const handleDestinationClick = (cityName) => {
    console.log("=== CLICKING DESTINATION ===");
    console.log("City name:", cityName);
    
    // Convert city name to URL-friendly slug
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
    console.log("Generated slug:", citySlug);
    
    navigate(`/destination/${citySlug}`);
    setIsExploreOpen(false);
    setIsMobileMenuOpen(false);
  };

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
    <div className="h-17 p-1 w-auto flex-shrink-0">
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
  <div 
    className={`hidden h-[34px] lg:h-[38px] w-[180px] lg:w-[220px] xl:w-[303px] px-3 lg:px-4 py-2 lg:py-3 justify-end items-center gap-2 border border-[#E8E7EA] rounded-md bg-white transition-all duration-300 flex-shrink-0 ${
      scrolled || isExploreOpen || !isHomePage 
        ? 'lg:flex opacity-100 visible pointer-events-auto' 
        : 'lg:flex opacity-0 invisible pointer-events-none'
    }`}
  >
    <input
      type="text"
      placeholder={scrolled || isExploreOpen || !isHomePage ? (window.innerWidth < 1200 ? "Search" : "Search") : "Search"}
      className="flex-1 text-[#8A8D95] font-roboto text-xs lg:text-sm xl:text-base font-normal outline-none bg-transparent placeholder:text-[#8A8D95] min-w-0"      tabIndex={scrolled || isExploreOpen || !isHomePage ? 0 : -1}
    />
    <SearchNormal1 
      size="20" 
      color="#8A8D95"
      className="lg:w-6 lg:h-6 flex-shrink-0"
    />
  </div>

  {/* Right Side - Responsive but compact */}
  <div className="hidden lg:flex items-center gap-1 lg:gap-2 xl:gap-4 flex-shrink-0">
    {/* Language Selector */}
    <div className="relative" ref={languageRef}>
      <button
        className={`${textColor} flex items-center space-x-1 xl:space-x-2 hover:opacity-80 px-1 xl:px-2 py-1 whitespace-nowrap`}
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          className="w-4 h-3 xl:w-5 xl:h-4 object-contain rounded-sm flex-shrink-0"
        />
        <span className="text-xs font-normal">
          {currentLanguage.code.toUpperCase()}
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
      <TripAdvisor
        className="w-8 h-6 lg:w-10 lg:h-8 xl:w-14 xl:h-12 transition-all duration-300"
  style={{ color: tripAdvisorFill }}
      />
    </div>

    {/* Book Now Button - More compact */}
    <button className="bg-[#2ba6a4] hover:bg-[#289795] text-white px-2 lg:px-3 xl:px-6 py-2 xl:py-3 rounded-lg font-medium transition-colors flex items-center space-x-1 xl:space-x-2 whitespace-nowrap flex-shrink-0 text-xs lg:text-sm xl:text-base">
      <IoLogoWhatsapp className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
      <span className="hidden lg:inline">{t("nav.bookNow")}</span>
    </button>
  </div>

  {/* Mobile Menu Button */}
  <button
    className={`lg:hidden ${textColor} flex-shrink-0`}
    onClick={() => setIsMobileMenuOpen(true)}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
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
                          onClick={() => handleDestinationClick(destination.name)}
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

      {/* ✅ FIXED Mobile Menu - Matches Figma Design Exactly */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden">
          <div className="w-full h-full bg-white flex flex-col">
            {/* Header Section */}
            <div className="flex justify-between items-center px-5 pt-5 pb-6 flex-shrink-0">
              <div className="p-1">
                <Logo className="h-12 w-auto" style={{ fill: "#0B101A" }} />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md bg-white flex justify-center items-center"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8A8D95"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="px-5 pb-6 flex-shrink-0">
              <div className="flex h-[45px] px-4 py-3 justify-between items-center gap-2 border border-[#E8E7EA] rounded-lg bg-white">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-1 text-[#8A8D95] font-roboto text-base font-normal outline-none bg-transparent placeholder:text-[#8A8D95]"
                />
                <SearchNormal1 
                  size="24" 
                  color="#8A8D95"
                  className="flex-shrink-0"
                />
              </div>
            </div>

            {/* Navigation Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-5">
              <div className="flex flex-col gap-6">
                {/* Explore with dropdown */}
                <div>
                  <button
                    className="flex justify-between items-center w-full py-3"
                    onClick={() => setIsExploreOpen(!isExploreOpen)}
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
                              className="flex items-start gap-4 p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                              onClick={() => {
                                handleDestinationClick(destination.name);
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
                  <div key={item.key} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      to={item.href}
                      className="flex items-center py-3 w-full"
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
                      className="flex items-center gap-2 px-2 py-2"
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    >
                      <img
                        src={currentLanguage.flag}
                        alt={currentLanguage.name}
                        className="w-6 h-5 object-contain rounded-sm flex-shrink-0"
                      />
                      <span className="text-[#090127] font-roboto text-sm font-normal leading-[18px]">
                        {currentLanguage.code.toUpperCase()}
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
                      <div className="absolute bottom-full mb-1 left-0 bg-white rounded-lg shadow-lg overflow-hidden z-50 min-w-[140px]">
                        <div className="py-2">
                          {languages.map((language, index) => (
                            <button
                              key={language.code}
                              onClick={() => handleLanguageChange(language.code)}
                              className={`flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 transition-colors ${
                                index !== languages.length - 1 ? 'border-b border-[#E6E6E8]' : ''
                              }`}
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
                <button className="flex px-6 py-3 justify-center items-center gap-2 w-full rounded-lg bg-[#1F7674] hover:bg-[#1a6564] transition-colors min-h-[48px]">
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