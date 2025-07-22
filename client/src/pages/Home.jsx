// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FeaturesGrid from '../components/FeaturesGrid';
import ExcursionCard from '../components/ExcursionCard';
import FAQ from '../components/FAQ';
import PaymentSection from '../components/PaymentSection';
import FAQSection from '../components/FAQSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CurrencyConverter from '../components/CurrencyConverter';
import PriceList from '../components/PriceList';
import { Link } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import publicService from '../services/publicService';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  // Fetch homepage data on component mount and language change
  useEffect(() => {
    fetchHomepageData();
  }, [i18n.language]);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const response = await publicService.getHomepageData(i18n.language);
      if (response.success) {
        setHomepageData(response.data);
        console.log('✅ Homepage data loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
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
            <div className="flex flex-wrap gap-2 items-center p-2 mt-9 rounded-2xl bg-white/50 mb-40">
              <div className="flex gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-1 py-2 flex-1 min-w-0">
                  <IoMdArrowDropdown className="w-5 h-5 text-white flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder={t("homepage.hero.searchDestination")}
                    className="bg-transparent text-white placeholder:text-white outline-none w-full text-sm lg:text-base font-semibold font-family-primary"
                  />
                </div>

                <div className="flex items-center gap-1 py-2 flex-1 min-w-0">
                  <IoMdArrowDropdown className="w-5 h-5 text-white flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder={t("homepage.hero.searchExcursions")}
                    className="bg-transparent text-white placeholder:text-white outline-none w-full text-sm lg:text-base font-semibold font-family-primary"
                  />
                </div>
              </div>

              <button className="w-10 h-10 p-2 text-lg font-medium text-center text-sea-green-700 bg-white rounded-sm hover:bg-white/90 transition-colors flex items-center justify-center flex-shrink-0">
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
          <FeaturesGrid section="next" position="top" />
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
              
              <button className="self-start flex items-center gap-2 text-lg font-semibold text-sea-green-900 font-family-primary bg-white-secondary2 px-8 py-2 rounded-[6px] hover:bg-teal-600 transition-colors">
                {t("common.seeAll")}
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Right Content - Cards with Real API Data */}
            <div className="flex-1 min-w-0">
              
              {/* Desktop: Regular flex wrap */}
              <div className="hidden lg:flex gap-6 xl:gap-8">
                {homepageData?.exploreCities?.slice(0, 3).map((city) => (
                  <Link
                    key={city.id}
                    to={`/destination/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col gap-4 flex-shrink-0"
                  >
                    <div className="w-56 xl:w-64 h-72 xl:h-80 rounded-lg overflow-hidden">
                      <img 
                        src={city.image_url} 
                        alt={city.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to static image
                          e.target.src = city.name.includes('Хургада') ? "/src/assets/Hurgada.jpg" :
                                        city.name.includes('Шарм') ? "/src/assets/sharm.jpg" :
                                        "/src/assets/marsa.jpg";
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
                      to={`/destination/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
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
            {homepageData?.featuredTours?.map((tour) => (
              <Link 
                key={tour.id} 
                to={`/destination/${tour.city_name?.toLowerCase().replace(/\s+/g, '-')}/${tour.id}`}
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
                  isFeatured={tour.featured_tag === 'popular'}
                  featuredLabel={getFeaturedLabel(tour.featured_tag)}
                />
              </Link>
            ))}
          </div>

          <button className="block mx-auto mt-8 px-6 py-3 text-[20px] text-sea-green-700 bg-white font-semibold border-white rounded-[6px] lg:rounded-md hover:bg-teal-600 transition-colors">
            {t("common.viewMore")}
          </button>
          
        </div>
      </section>

      {/* Payment Section */}
      <PaymentSection onOpenConverter={() => setIsCurrencyConverterOpen(true)} />
      
      {/* FAQ Section with Price Lists */}
      {/* <FAQSection onOpenPriceList={() => setIsPriceListOpen(true)} /> */}
      <FAQSection 
      onOpenPriceList={() => setIsPriceListOpen(true)} 
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
        pricesData={homepageData?.todaysPrices}
      />

      {/* Original FAQ Section */}
      <section>
        <FAQ />
      </section>
    </div>
  );
};

export default Home;