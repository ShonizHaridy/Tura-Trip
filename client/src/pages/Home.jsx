// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FeaturesGrid from '../components/FeaturesGrid';
import ExcursionCard from '../components/ExcursionCard';
import PricesSection from '../components/PricesSection';
import FAQ from '../components/FAQ';
import PaymentSection from '../components/PaymentSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CurrencyConverter from '../components/CurrencyConverter';
import PriceList from '../components/PriceList';
import { Link } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import publicService from '../services/publicService';
import { useNavigate } from 'react-router-dom';

import { SlugHelper } from '../utils/slugHelper';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [homepageData, setHomepageData] = useState(null);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreTours, setHasMoreTours] = useState(false);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  const [selectedCityId, setSelectedCityId] = useState(null); // null = show all cities

  const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState('');
const [selectedCity, setSelectedCity] = useState(null);
const [selectedCategory, setSelectedCategory] = useState(null);
const [categories, setCategories] = useState([]);
const [cities, setCities] = useState([]);
const [quickSuggestions, setQuickSuggestions] = useState(null);
const [showSuggestions, setShowSuggestions] = useState(false);
const [showCityDropdown, setShowCityDropdown] = useState(false);
const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
const [suggestionLoading, setSuggestionLoading] = useState(false);

  const cityDropdownRef = useRef(null);
const categoryDropdownRef = useRef(null);
const searchContainerRef = useRef(null);


  // Fetch homepage data on component mount and language change
  useEffect(() => {
    fetchHomepageData();
  fetchCategoriesForSearch();
  fetchCitiesForSearch();
  }, [i18n.language]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
      setShowCityDropdown(false);
    }
    if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
      setShowCategoryDropdown(false);
    }
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };
    document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const response = await publicService.getHomepageData(i18n.language);
      if (response.success) {
        setHomepageData(response.data);
        setFeaturedTours(response.data.featuredTours || []);
        setHasMoreTours(response.data.hasMoreFeatured || false);
        console.log('✅ Homepage data loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

const fetchCategoriesForSearch = async () => {
  try {
    const response = await publicService.getPublicCategories(i18n.language);
    if (response.success) {
      setCategories(response.data);
    }
  } catch (error) {
    console.error('Error fetching categories for search:', error);
  }
};

const fetchCitiesForSearch = async () => {
  try {
    const response = await publicService.getCitiesForHeader(i18n.language);
    if (response.success) {
      setCities(response.data);
    }
  } catch (error) {
    console.error('Error fetching cities for search:', error);
  }
};

  const handleSearch = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions(null);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await publicService.getSearchSuggestions(query, i18n.language);
      if (response.success) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    } finally {
      setSearchLoading(false);
    }
  };

const handleQuickSearch = async (query) => {
  if (!query || query.length < 2) {
    setQuickSuggestions(null);
    setShowSuggestions(false);
    return;
  }

  try {
    setSuggestionLoading(true);
    const response = await publicService.getSearchSuggestions(query, i18n.language);
    if (response.success) {
      setQuickSuggestions(response.data);
      setShowSuggestions(true);
    }
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
  } finally {
    setSuggestionLoading(false);
  }
};


const handleSearchSubmit = () => {
  if (selectedCity && selectedCategory) {
    const citySlug = selectedCity.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destination/${citySlug}?category_id=${selectedCategory.id}`);
  } else if (selectedCity) {
    const citySlug = selectedCity.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destination/${citySlug}`);
  } else if (searchQuery) {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  }
};
const handleCitySelect = (city) => {
  setSelectedCity(city);
  setShowCityDropdown(false);
};

const handleCategorySelect = (category) => {
  setSelectedCategory(category);
  setShowCategoryDropdown(false);
};

const handleSuggestionClick = (suggestion) => {
  setShowSuggestions(false);
  setSearchQuery('');
  
  if (suggestion.type === 'city') {
    const citySlug = suggestion.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destination/${citySlug}`);
  } else if (suggestion.type === 'tour') {
    const citySlug = suggestion.city_name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destination/${citySlug}/${suggestion.id}`);
  } else if (suggestion.type === 'category') {
    navigate(`/search?category_id=${suggestion.id}`);
  }
};





  // Load more featured tours
  const loadMoreTours = async () => {
    try {
      setLoadingMore(true);
      const currentOffset = featuredTours.length;
      const response = await publicService.getMoreFeaturedTours(i18n.language, currentOffset, 6);
      
      if (response.success && response.data.tours) {
        setFeaturedTours(prev => [...prev, ...response.data.tours]);
        setHasMoreTours(response.data.hasMore || false);
      }
    } catch (error) {
      console.error('Error loading more tours:', error);
    } finally {
      setLoadingMore(false);
    }
  };


  const getFilteredPriceData = () => {
    if (!selectedCityId || !homepageData?.todaysPrices) {
      return homepageData?.todaysPrices || []; // Show all cities
    }
    
    const selectedCity = homepageData.todaysPrices.find(
      city => city.city_id === selectedCityId
    );
    return selectedCity ? [selectedCity] : [];
  };

  const handleOpenPriceList = (cityId = null) => {
    setSelectedCityId(cityId);
    setIsPriceListOpen(true);
  };


  // Helper function to get featured label translation
  const getFeaturedLabel = (featuredTag) => {
    switch (featuredTag) {
      case 'popular':
        return t("common.popular");
      case 'great_value':
        return t("common.greatValue");
      case 'new':
        return t("common.new");
      default:
        return '';
    }
  };

  // Helper function to calculate original price from discount
  const getOriginalPrice = (currentPrice, discountPercentage) => {
    if (discountPercentage > 0) {
      return Math.round(currentPrice / (1 - discountPercentage / 100));
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero section with full viewport height */}
      <section
        className="relative min-h-screen w-full bg-[url('/src/assets/hero-bg.png')] bg-cover bg-center flex flex-col justify-center text-white"
      >
        <div className="container mx-auto px-4 lg:px-8 pt-18 lg:pt-24">
          <div className="relative mt-8 -mb-11 w-full lg:w-4/5 xl:w-3/4 max-md:mt-10 max-md:mb-2.5 justify-start">
            <div className="w-full text-white max-md:max-w-full">
              <div className="text-xs font-plus-jakarta font-medium leading-none uppercase tracking-[2.4px] max-md:max-w-full">
                {t("homepage.hero.subtitle")}
              </div>
              <h1 className="mt-2 font-great-vibes text-3xl lg:text-[84px] leading-[1.2] max-md:max-w-full max-md:text-4xl space-y-0">
                <span>{t("homepage.hero.title1")}</span>
                <br />
                <span>{t("homepage.hero.title2")}</span>
              </h1>
            </div>
            <p className="mt-4 text-sm lg:text-base leading-[1.4] lg:leading-[1.225] font-plus-jakarta font-normal text-white max-md:max-w-full">
              {t("homepage.hero.description")}
            </p>

            {/* Search Form */}
            {/* Search Form - Enhanced with functionality */}
            <div className="flex flex-wrap gap-2 items-center p-2 mt-9 rounded-2xl bg-white/50 mb-40" ref={searchContainerRef}>
              <div className="flex gap-2 flex-1 min-w-0">
                {/* City/Destination Dropdown */}
                <div className="flex items-center gap-1 py-2 flex-1 min-w-0 relative" ref={cityDropdownRef}>
                  <IoMdArrowDropdown 
                    className={`w-5 h-5 text-white flex-shrink-0 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} 
                  />
                  <input
                    type="text"
                    placeholder={selectedCity ? selectedCity.name : t("homepage.hero.searchDestination")}
                    className="bg-transparent text-white placeholder:text-white outline-none w-full text-sm lg:text-base font-semibold font-family-primary cursor-pointer"
                    readOnly
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                  />
      
                  {/* City Dropdown */}
                  {showCityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
                      {cities.length > 0 ? (
                        cities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-800 border-b border-gray-100 last:border-b-0"
                          >
                            {city.image_url && (
                              <img
                                src={city.image_url}
                                alt={city.name}
                                className="w-8 h-8 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{city.name}</div>
                              {city.tours_count && (
                                <div className="text-xs text-gray-500">
                                  {city.tours_count} {t('common.tours')}
                                </div>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                          {t('common.noDestinations')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Category/Excursions Dropdown */}
                <div className="flex items-center gap-1 py-2 flex-1 min-w-0 relative" ref={categoryDropdownRef}>
                  <IoMdArrowDropdown 
                    className={`w-5 h-5 text-white flex-shrink-0 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                  />
                  <input
                    type="text"
                    placeholder={selectedCategory ? selectedCategory.name : t("homepage.hero.searchCategory")}
                    className="bg-transparent text-white placeholder:text-white outline-none w-full text-sm lg:text-base font-semibold font-family-primary cursor-pointer"
                    readOnly
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  />
                  
                  {/* Category Dropdown */}
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-800 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-sm">{category.name}</div>
                            <div className="text-xs text-gray-500">
                              {category.tours_count} {t('common.tours')}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                          {t('common.noCategories')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Search Input */}
                <div className="hidden lg:flex items-center gap-1 py-2 flex-1 min-w-0 relative">
                  <input
                    type="text"
                    placeholder={t("homepage.hero.quickSearch") || "Quick search..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleQuickSearch(e.target.value);
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    className="bg-transparent text-white placeholder:text-white outline-none w-full text-sm lg:text-base font-semibold font-family-primary"
                  />
                  
                  {/* Quick Search Suggestions */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                      {suggestionLoading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
                          <p className="text-gray-500 text-sm mt-2">{t('common.searching')}</p>
                        </div>
                      ) : quickSuggestions && (quickSuggestions.cities?.length > 0 || quickSuggestions.tours?.length > 0 || quickSuggestions.categories?.length > 0) ? (
                        <>
                          {/* Cities */}
                          {quickSuggestions.cities?.length > 0 && (
                            <div className="border-b border-gray-100">
                              <div className="px-4 py-2 bg-gray-50 text-[5px] lg:text-xs font-medium text-gray-500 uppercase">
                                {t('common.destinations')}
                              </div>
                              {quickSuggestions.cities.map((city) => (
                                <button
                                  key={`city-${city.id}`}
                                  onClick={() => handleSuggestionClick(city)}
                                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                                >
                                  <img
                                    src={city.image_url || '/placeholder.jpg'}
                                    alt={city.name}
                                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm">{city.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {city.tours_count} {t('common.tours')}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Categories */}
                          {quickSuggestions.categories?.length > 0 && (
                            <div className="border-b border-gray-100">
                              <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                                {t('common.categories')}
                              </div>
                              {quickSuggestions.categories.map((category) => (
                                <button
                                  key={`category-${category.id}`}
                                  onClick={() => handleSuggestionClick(category)}
                                  className="w-full px-4 py-3 hover:bg-gray-50 text-gray-800 border-b border-gray-50 last:border-b-0"
                                >
                                  <div className="font-medium text-sm">{category.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {category.tours_count} {t('common.tours')}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Tours */}
                          {quickSuggestions.tours?.length > 0 && (
                            <div>
                              <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                                {t('common.tours')}
                              </div>
                              {quickSuggestions.tours.map((tour) => (
                                <button
                                  key={`tour-${tour.id}`}
                                  onClick={() => handleSuggestionClick(tour)}
                                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                                >
                                  <img
                                    src={tour.image_url || '/placeholder.jpg'}
                                    alt={tour.name}
                                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm">{tour.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {tour.city_name} • {tour.category_name}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Show More Results */}
                          <div className="border-t border-gray-100 p-3">
                            <button
                              onClick={() => {
                                setShowSuggestions(false);
                                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                              }}
                              className="w-full text-center text-sm text-teal-600 hover:text-teal-800 font-medium"
                            >
                              {t('common.showMoreResults')} →
                            </button>
                          </div>
                        </>
                      ) : searchQuery && (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                          {t('common.noResults')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSearchSubmit}
                className="w-10 h-10 p-2 text-lg font-medium text-center text-sea-green-700 bg-white rounded-sm hover:bg-white/90 transition-colors flex items-center justify-center flex-shrink-0"
              >
                <FiSearch className="" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Features - positioned at very bottom of hero section */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full px-4 z-10">
          <FeaturesGrid section="hero" position="bottom" />
        </div>
      </section>

      {/* Explore section */}
      <section className="relative min-h-screen bg-[url('/src/assets/explore-bg.png')] bg-cover bg-center">
        {/* Next Features - positioned at very top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full px-4 z-10">
          <FeaturesGrid section="explore" position="top" />
        </div>

        {/* Main Content */}
        <div className="relative z-20 px-4 sm:px-6 lg:px-8 xl:px-32 pt-30 lg:pt-32">

          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h2 className="font-great-vibes text-[32px] sm:text-6xl lg:text-8xl font-normal text-danim-800 leading-[1.2] mb-6">
              {t("homepage.explore.title")}
            </h2>
            <hr className="border-t-2 border-white-secondary w-full" />
          </div>

          {/* Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24">

            {/* Left Content - Text */}
            <div className="flex flex-col gap-6 lg:gap-8 lg:flex-shrink-0 lg:w-80 xl:w-96">
              <p className="text-base lg:text-lg text-white leading-tight">
                {t("homepage.explore.description")}
              </p>

              <Link 
                to="/browse-tours"
                className="self-start flex items-center gap-2 text-lg font-semibold text-sea-green-900 font-family-primary bg-white-secondary2 px-8 py-2 rounded-[6px] hover:bg-teal-600 transition-colors"
              >
                {t("common.seeAll")}
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right Content - Cards with Real API Data */}
            <div className="flex-1 min-w-0">

              {/* Desktop: Regular flex wrap */}
              <div className="hidden lg:flex gap-6 xl:gap-8">
                {homepageData?.exploreCities?.slice(0, 3).map((city) => (
                <Link
                  key={city.id}
                  to={`/destination/${city.slug}`}
                  className="flex flex-col gap-4 flex-shrink-0"
                >
                    <div className="w-56 xl:w-64 h-72 xl:h-80 rounded-lg overflow-hidden">
                      <img
                        src={city.image_url}
                        alt={city.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log(`Error loading image for ${city.name}:`, e);
                          // Fallback to static image
                          e.target.src = city.name.includes('Хургада') ? "/images/Hurgada.jpg" :
                            city.name.includes('Шарм') ? "/images/sharm.jpg" :
                            "/images/marsa.jpg";
                        }}
                      />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-normal text-danim-800 text-center">
                      {city.name.toUpperCase()}
                    </h3>
                  </Link>
                ))}
              </div>

              {/* Mobile/Tablet: Horizontal scroll */}
              <div className="lg:hidden overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
                  {homepageData?.exploreCities?.map((city) => (
                    <Link
                      key={city.id}
                      to={`/destination/${city.slug}`}
                      className="flex flex-col gap-4 flex-shrink-0"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-lg overflow-hidden">
                        <img
                          src={city.image_url}
                          alt={city.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to static image
                            e.target.src = city.name.includes('Хургада') ? "/src/assets/Hurgada.jpg" :
                              city.name.includes('Шарм') ? "/src/assets/sharm.jpg" :
                              "/src/assets/marsa.jpg";
                          }}
                        />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-normal text-danim-800 text-center">
                        {city.name.toUpperCase()}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Deals Section with Real API Data */}
      <section className="relative min-h-screen bg-[url('/src/assets/explore-bg.png')] bg-cover bg-center">
        <div className="container mx-auto pt-10 px-6 lg:px-8 xl:px-12">

          {/* Header text - centered and constrained */}
          <div className="text-center mb-10">
            <h2 className="font-great-vibes font-normal text-[32px] lg:text-4xl leading-[44px] tracking-[-0.02em] text-center text-gray-800 mb-4">
              {t("homepage.bestDeals.title")}
            </h2>
            <p className="text-lg text-gray-600 font-family-primary">
              {t("homepage.bestDeals.subtitle")}
            </p>
          </div>

          {/* Cards grid - responsive layout using real featured tours */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-10">
            {featuredTours.map((tour) => (
              <Link
                key={tour.id}
                to={`/destination/${tour.city_slug}/${tour.id}`}
              >
                <ExcursionCard
                  id={tour.id}
                  title={tour.title || "Tour Title Not Available"}
                  image={tour.cover_image_url || "/src/assets/luxor.png"}
                  category={tour.category || tour.category_type}
                  duration={tour.duration || "Full Day"}
                  durationUnit=""
                  transportation={tour.availability || "Daily"}
                  daysOfWeek={tour.days_of_week}
                  reviews={tour.reviews_count || 0}
                  price={parseFloat(tour.price_adult)}
                  originalPrice={getOriginalPrice(parseFloat(tour.price_adult), parseFloat(tour.discount_percentage))}
                  priceUnit={t("common.perPerson")}
                  isFeatured={tour.featured_tag != null}
                  featuredLabel={getFeaturedLabel(tour.featured_tag)}
                />
              </Link>
            ))}
          </div>

          {/* View More Button */}
          {hasMoreTours && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMoreTours}
                disabled={loadingMore}
                className="px-6 py-3 text-[20px] text-sea-green-700 bg-white font-semibold border-white rounded-[6px] lg:rounded-md hover:bg-[#B0B2B7] hover:border-[#868683] hover:text-[#343946] transition-colors disabled:opacity-50"
              >
                {loadingMore ? t("common.loading") : t("common.viewMore")}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Payment Section */}
      <PaymentSection onOpenConverter={() => setIsCurrencyConverterOpen(true)} />

      {/* FAQ Section with Price Lists */}
      <PricesSection
        onOpenPriceList={handleOpenPriceList} 
        todaysPrices={homepageData?.todaysPrices}
      />

      {/* Testimonials Section with Real API Data */}
      <TestimonialsSection reviews={homepageData?.promotionalReviews} />

      {/* Modals */}
      <CurrencyConverter
        isOpen={isCurrencyConverterOpen}
        onClose={() => setIsCurrencyConverterOpen(false)}
      />

      <PriceList
        isOpen={isPriceListOpen}
        onClose={() => setIsPriceListOpen(false)}
        pricesData={getFilteredPriceData()}
      />

      {/* Original FAQ Section */}
      <section>
        <FAQ />
      </section>
    </div>
  );
};

export default Home;