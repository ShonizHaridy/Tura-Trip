// src/pages/City.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExcursionCard from "../components/ExcursionCard";
import PriceList from "../components/PriceList";
import publicService from "../services/publicService";
import useClickOutside from "../hooks/useClickOutside";
import {
  ArrowDown2,
  WalletRemove,
  Shield,
  EyeSlash,
} from "iconsax-react";

import { useTranslatedFeaturedLabel } from "../hooks/useTranslatedFeaturedLabel";

const City = () => {
  const { cityName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const getTranslatedFeaturedLabel = useTranslatedFeaturedLabel();
  
  // State management
  const [cityData, setCityData] = useState(null);
  const [tours, setTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Trips");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Ref for cleanup
  const abortControllerRef = useRef(null);

  // Price list modal ref for click outside
  const priceListRef = useClickOutside(() => {
    setIsPriceListOpen(false);
  });

  // Check for category parameter from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch city data on mount and language change
  useEffect(() => {
    fetchCityData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cityName, i18n.language]);

  // Reset page when category changes
  useEffect(() => {
    if (selectedCategory && cityData) {
      setCurrentPage(1);
      fetchCityData(1, getSelectedCategoryId());
    }
  }, [selectedCategory]);

  const fetchCityData = async (page = 1, categoryId = null, loadAll = false) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const params = {
        language: i18n.language,
        page: loadAll ? 1 : page,
        limit: loadAll ? 100 : 6,
      };
      
      if (categoryId) {
        params.category_id = categoryId;
      }
      
      const response = await publicService.getCityData(cityName, params);
      
      if (response.success) {
        const { 
          city, 
          tours: newTours, 
          categories: apiCategories, 
          pagination: paginationData,
          todaysPrices  // ← Add this
        } = response.data;
        
        // Merge todaysPrices with city data
        setCityData({
          ...city,
          todaysPrices  // ← Include todaysPrices in cityData
        });      
          
        setPagination(paginationData);
        console.log('City data:', city);
        
        if (page === 1) {
          setTours(newTours || []);
          
          if (!categoryId && !loadAll) {
            setAllTours(newTours || []);
          }
          
          const allTripsCategory = { 
            id: null, 
            name: t('common.allTrips') || "All Trips", 
            tours_count: paginationData.totalItems 
          };
          setCategories([allTripsCategory, ...(apiCategories || [])]);
        } else {
          setTours(prev => [...prev, ...(newTours || [])]);
        }
        
        if (loadAll) {
          setAllTours(newTours || []);
        }
        
        setCurrentPage(page);
        console.log('✅ City data loaded:', response.data);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching city data:', error);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getSelectedCategoryId = () => {
    if (selectedCategory === (t('common.allTrips') || "All Trips")) return null;
    const category = categories.find(cat => cat.name === selectedCategory);
    return category ? category.id : null;
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    
    // Update URL params
    if (categoryName === (t('common.allTrips') || "All Trips")) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  const handleViewMore = () => {
    if (pagination && pagination.hasMore) {
      const nextPage = currentPage + 1;
      fetchCityData(nextPage, getSelectedCategoryId());
    }
  };

// In City.jsx, add this debugging code in the handleShowPricing function
const handleShowPricing = async () => {
  console.log("=== PRICE LIST DEBUG START ===");
  console.log("cityData:", cityData);
  console.log("cityData.todaysPrices:", cityData?.todaysPrices);
  console.log("allTours length:", allTours.length);
  
  if (allTours.length === 0) {
    console.log("📋 Fetching all tours because allTours is empty...");
    await fetchCityData(1, null, true);
  }
  
  // Debug the data being prepared for PriceList
  const pricesDataToSend = cityData?.todaysPrices ? [{
    city_name: cityData.name,
    tours: (cityData.todaysPrices.tours || []).map(tour => {
      console.log("Processing tour:", tour);
      return {
        ...tour,
        title: tour.title || `${t('common.tourTitle')} #${tour.id}`,
        price_adult: parseFloat(tour.price_adult),
        price_child: parseFloat(tour.price_child)
      };
    })
  }] : [];
  
  console.log("📤 Data being sent to PriceList:", pricesDataToSend);
  console.log("=== PRICE LIST DEBUG END ===");
  
  setIsPriceListOpen(true);
};

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const getCitySlug = () => {
    // return cityName.toLowerCase().replace(/\s+/g, '-');
    return cityName
  };

  if (loading && !tours.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{t("common.loading") || "Loading..."}</div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">
          {t("common.cityNotFound") || "City not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] lg:pt-[100px]">
      {/* Category Tabs - Fixed position */}
      <div className="w-full flex flex-col items-start border-b-2 border-[#E6E6E8] shadow-[0px_2px_12px_0px_rgba(20,20,43,0.08)] bg-white fixed top-[85px] md:top-[100px] left-0 right-0 z-40">
        <div className="w-full px-2 lg:px-[70px] h-12">
          <div className="flex h-12 items-center overflow-x-auto">
            {categories.map((category) => (
              <div
                key={category.id || 'all'}
                className={`flex-shrink-0 flex items-center justify-center px-6 h-12 cursor-pointer transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "bg-[rgba(234,246,246,0.60)] border-b-2 border-[#2BA6A4]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                <div className="flex flex-col justify-center items-center gap-1 h-[27px]">
                  <span
                    className={`text-base font-bold text-center whitespace-nowrap ${
                      selectedCategory === category.name
                        ? "text-[#1F7674]"
                        : "text-[#8A8D95]"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-[70px] pt-12 md:pt-16">
        {/* Breadcrumb */}
        <div className="inline-flex items-center gap-4 py-6 rounded-md">
          <div 
            className="flex w-5 h-5 justify-center items-center cursor-pointer hover:opacity-70"
            onClick={() => window.location.href = '/'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.7071 2.29289C10.3166 1.90237 9.68342 1.90237 9.29289 2.29289L2.29289 9.29289C1.90237 9.68342 1.90237 10.3166 2.29289 10.7071C2.68342 11.0976 3.31658 11.0976 3.70711 10.7071L4 10.4142V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 17.5523 8 17V15C8 14.4477 8.44772 14 9 14H11C11.5523 14 12 14.4477 12 15V17C12 17.5523 12.4477 18 13 18H15C15.5523 18 16 17.5523 16 17V10.4142L16.2929 10.7071C16.6834 11.0976 17.3166 11.0976 17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289L10.7071 2.29289Z"
                fill="#8A8D95"
              />
            </svg>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
              fill="#9CA3AF"
            />
          </svg>
          <div className="flex justify-center items-center">
            <span className="text-sm font-bold text-[#555A64] font-roboto">
              {cityData.name}
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
              fill="#9CA3AF"
            />
          </svg>
          <div className="flex justify-center items-center">
            <span className="text-sm font-bold text-[#555A64] font-roboto">
              {selectedCategory}
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative w-full h-[260px] lg:h-[349px] rounded-[32px] overflow-hidden mb-8">
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              background: `linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), url('${cityData.image_url || cityData.image}') lightgray 50% / cover no-repeat`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-4xl md:text-[56px] font-bold text-[#F3F3EE] mb-2 leading-normal">
                {cityData.name}
              </h1>
              {cityData.tagline && (
                <p className="text-lg md:text-2xl font-medium text-[#F7F7F4] max-w-lg">
                  {cityData.tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full flex flex-col gap-10 mb-20">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-[32px] font-semibold text-[#2D467C]">
                {t('city.about') || 'About'}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-lg md:text-xl font-normal text-[#555A64] leading-[25.4px]">
                {cityData.description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <WalletRemove size={32} color="#3F62AE" variant="Bulk" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-[#2D467C]">
                  {t('features.noPrepayment') || 'No Prepayment'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Shield size={32} color="#3F62AE" variant="Bulk" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-[#2D467C]">
                  {t('features.insuranceValid') || 'Insurance is Valid'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <EyeSlash size={32} color="#3F62AE" variant="Bulk" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-[#2D467C]">
                  {t('features.noHiddenExtra') || 'No Hidden Extra'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="flex flex-col gap-6">
            <div
              className="flex items-center justify-between w-full p-6 rounded-md bg-[#EAF6F6] cursor-pointer"
              onClick={handleShowPricing}
            >
              <div className="flex items-center gap-4">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path
                    d="M12 1.5V23.5M17 5.5H9.5C8.57174 5.5 7.6815 5.86875 7.02513 6.52513C6.36875 7.1815 6 8.07174 6 9C6 9.92826 6.36875 10.8185 7.02513 11.4749C7.6815 12.1313 8.57174 12.5 9.5 12.5H14.5C15.4283 12.5 16.3185 12.8687 16.9749 13.5251C17.6313 14.1815 18 15.0717 18 16C18 16.9283 17.6313 17.8185 16.9749 18.4749C16.3185 19.1313 15.4283 19.5 14.5 19.5H6"
                    stroke="#2D467C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xl font-medium text-[#2D467C]">
                  {t('city.currentPrices') || 'Current prices Today in'} {cityData.name}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-px h-9 bg-[#ADADA9]"></div>
                <ArrowDown2
                  size={32}
                  color="#3F62AE"
                />
              </div>
            </div>
          </div>
        </div>

        {/* All Trips Section */}
        <div className="flex flex-col gap-5 mb-20">
          <div className="w-full">
            <h2 className="text-4xl md:text-[60px] font-normal text-[#3F62AE] leading-[44px] tracking-[-1.2px] font-['Bebas_Neue']">
              {selectedCategory.toUpperCase()}
            </h2>
          </div>
          <div className="w-full h-px bg-[#B3B3B3]"></div>
        </div>

        {/* Trip Cards Grid */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {tours.map((tour) => (
              <Link key={tour.id} to={`/destination/${getCitySlug()}/${tour.id}`}>
                <ExcursionCard
                  id={tour.id}
                  title={tour.title || t('common.tourTitle') || 'Tour Title Not Available'}
                  image={tour.cover_image_url || "/src/assets/luxor.png"}
                  category={tour.category || tour.category_type}
                  duration={tour.duration || t('common.fullDay') || "Full Day"}
                  durationUnit=""
                  daysOfWeek={tour.availability || t('common.daily') || "Daily"}
                  reviews={tour.reviews_count || 0}
                  price={parseFloat(tour.price_adult)}
                  originalPrice={tour.discount_percentage > 0 ? Math.round(parseFloat(tour.price_adult) / (1 - tour.discount_percentage / 100)) : null}
                  priceUnit={t('common.perPerson') || "per person"}
                  isFeatured={tour.featured_tag !== null && tour.featured_tag !== undefined}
                  featuredLabel={getTranslatedFeaturedLabel(tour.featured_tag) || t('common.featured') || "Featured"}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p className="text-xl mb-4">{t('common.noToursFound') || 'No tours found for the selected category.'}</p>
            <p className="text-gray-400">{t('common.tryDifferentCategory') || 'Try selecting a different category or check back later.'}</p>
          </div>
        )}

        {/* View More Button */}
        {pagination && pagination.hasMore && (
          <div className="flex flex-col items-center gap-2.5 w-full mb-20">
          <button 
            onClick={handleViewMore}
            disabled={loadingMore}
            className="flex w-[266px] px-4 py-2 justify-center items-center gap-3 rounded-md border border-[#1F7674] bg-[#F3F3EE] hover:bg-[#B0B2B7] hover:border-[#868683] disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
          >
            <span className="text-xl font-semibold text-[#1F7674] font-roboto group-hover:text-[#343946] transition-colors">
              {loadingMore ? (t('common.loading') || "Loading...") : (t('common.viewMore') || "View More")}
            </span>
          </button>
            <div className="text-sm text-gray-500 text-center">
              {t('city.showing')} {tours.length} {t('city.of')} {pagination.totalItems} {t('city.tours')}
              {pagination.totalPages > 1 && (
                <span className="block mt-1">
                  {t('city.page')} {pagination.currentPage} {t('city.of')} {pagination.totalPages}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price List Modal with click outside functionality */}
      {isPriceListOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div ref={priceListRef}>
          <PriceList
            isOpen={isPriceListOpen}
            onClose={() => setIsPriceListOpen(false)}
            pricesData={cityData?.todaysPrices ? [{
              city_name: cityData.name,
              tours: (cityData.todaysPrices.tours || []).map(tour => ({
                ...tour,
                title: tour.title || `${t('common.tourTitle')} #${tour.id}`,
                price_adult: parseFloat(tour.price_adult),
                price_child: parseFloat(tour.price_child)
              }))
            }] : []}
          />
          </div>
        </div>
      )}
    </div>
  );
};

export default City;