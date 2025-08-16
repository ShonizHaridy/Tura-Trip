// src/pages/BrowseTours.jsx - Complete updated component

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from '../hooks/useSmartNavigation';
import { default as Link } from '../components/SmartLink';
import { SlugHelper } from '../utils/slugHelper';
import ExcursionCard from '../components/ExcursionCard';
import publicService from '../services/publicService';
import { 
  Location, 
  Calendar2, 
  DollarCircle, 
  ArrowRight2,
  Buildings2,
  Map1
} from 'iconsax-react';

import { useTranslatedFeaturedLabel } from '../hooks/useTranslatedFeaturedLabel';

const BrowseTours = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation(); 
  const [browseData, setBrowseData] = useState(null);
  const [allToursData, setAllToursData] = useState(null); // Separate state for all tours data
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(location.state?.viewMode || 'cities');
  const [loadingViewChange, setLoadingViewChange] = useState(false);

  const getTranslatedFeaturedLabel = useTranslatedFeaturedLabel();

  useEffect(() => {
    fetchInitialData();
  }, [i18n.language]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Always start with cities view (limited tours per city)
      const response = await publicService.getBrowseToursData(i18n.language, false);
      if (response.success) {
        setBrowseData(response.data);
        console.log('Initial browse data loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching initial browse data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllToursData = async () => {
    try {
      setLoadingViewChange(true);
      const response = await publicService.getBrowseToursData(i18n.language, true);
      if (response.success) {
        setAllToursData(response.data);
        console.log('All tours data loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching all tours data:', error);
    } finally {
      setLoadingViewChange(false);
    }
  };

  const getAllTours = () => {
    const dataToUse = viewMode === 'tours' && allToursData ? allToursData : browseData;
    if (!dataToUse) return [];
    
    return dataToUse.cities.flatMap(city => 
      city.tours.map(tour => ({
        ...tour,
        city_slug: city.slug,
        city_name: city.city_name
      }))
    );
  };

  const handleViewModeChange = async (mode) => {
    if (mode === viewMode) return; // Don't refetch if same mode
    
    setViewMode(mode);
    
    if (mode === 'tours' && !allToursData) {
      // Only fetch all tours data if we don't have it yet
      await fetchAllToursData();
    }
    // For cities mode, we already have the limited data in browseData
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sea-green-600"></div>
      </div>
    );
  }

  if (!browseData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-xl text-rose-black-300 font-family-primary">
          {t('browseTours.failedToLoad') || 'Failed to load tours data'}
        </div>
      </div>
    );
  }

  // Use the appropriate dataset based on view mode
  const currentData = viewMode === 'tours' && allToursData ? allToursData : browseData;

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-danim to-sea-green-600 text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-family-display text-4xl lg:text-6xl xl:text-7xl font-normal mb-4 tracking-wide">
            {t('browseTours.title') || 'EXPLORE ALL DESTINATIONS'}
          </h1>
          <p className="font-family-primary text-lg lg:text-xl xl:text-2xl mb-8 max-w-4xl mx-auto text-white/90 leading-relaxed">
            {t('browseTours.subtitle') || 'Discover amazing tours across Egypt\'s most beautiful destinations and create unforgettable memories'}
          </p>
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 mt-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Buildings2 size={32} color="currentColor" variant="Bulk" className="text-white" />
              </div>
              <div className="font-family-primary text-3xl lg:text-4xl font-bold">
                {currentData.statistics.total_cities}
              </div>
              <div className="font-family-primary text-white/80 text-sm lg:text-base">
                {t('browseTours.cities') || 'Cities'}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Map1 size={32} color="currentColor" variant="Bulk" className="text-white" />
              </div>
              <div className="font-family-primary text-3xl lg:text-4xl font-bold">
                {currentData.statistics.total_tours}
              </div>
              <div className="font-family-primary text-white/80 text-sm lg:text-base">
                {t('browseTours.tours') || 'Tours'}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarCircle size={32} color="currentColor" variant="Bulk" className="text-white" />
              </div>
              <div className="font-family-primary text-2xl lg:text-3xl font-bold">
                ${Math.round(currentData.statistics.price_range.min)}-${Math.round(currentData.statistics.price_range.max)}
              </div>
              <div className="font-family-primary text-white/80 text-sm lg:text-base">
                {t('browseTours.priceRange') || 'Price Range'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Toggle */}
      <section className="bg-isabelline py-6 lg:py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-white-secondary rounded-xl p-1 shadow-soft">
              <button
                onClick={() => handleViewModeChange('cities')}
                disabled={loadingViewChange}
                className={`px-6 lg:px-8 py-3 rounded-lg font-family-primary font-semibold transition-all duration-200 ${
                  viewMode === 'cities'
                    ? 'bg-danim text-white shadow-soft'
                    : 'text-danim-800 hover:bg-danim-50'
                } ${loadingViewChange ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {t('browseTours.viewByCities') || 'View by Cities'}
              </button>
              <button
                onClick={() => handleViewModeChange('tours')}
                disabled={loadingViewChange}
                className={`px-6 lg:px-8 py-3 rounded-lg font-family-primary font-semibold transition-all duration-200 ${
                  viewMode === 'tours'
                    ? 'bg-danim text-white shadow-soft'
                    : 'text-danim-800 hover:bg-danim-50'
                } ${loadingViewChange ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingViewChange && viewMode !== 'tours' ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Loading...
                  </span>
                ) : (
                  t('browseTours.viewAllTours') || 'All Tours'
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {viewMode === 'cities' ? (
            /* Cities View - Shows max 6 tours per city */
            <div className="space-y-16 lg:space-y-24">
              {browseData.cities.map((city) => (
                <div key={city.city_id} className="space-y-8 lg:space-y-12">
                  {/* City Header */}
                  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    <div className="w-full lg:w-96 h-64 lg:h-80 rounded-2xl lg:rounded-3xl overflow-hidden flex-shrink-0 shadow-medium">
                      <img
                        src={city.city_image_url || '/placeholder-city.jpg'}
                        alt={city.city_name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/placeholder-city.jpg'; }}
                      />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <h2 className="font-family-display text-4xl lg:text-5xl xl:text-6xl font-normal text-danim-800 mb-3 lg:mb-4 tracking-wide">
                        {city.city_name.toUpperCase()}
                      </h2>
                      {city.city_tagline && (
                        <p className="font-great-vibes text-2xl lg:text-3xl text-sea-green-600 mb-4 lg:mb-6">
                          {city.city_tagline}
                        </p>
                      )}
                      <p className="font-family-primary text-rose-black-300 text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed">
                        {city.city_description}
                      </p>
                      
                      {/* City Stats */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8 mb-8">
                        <div className="flex items-center gap-2">
                          <Calendar2 size={24} color="#3F62AE" variant="Bulk" />
                          <span className="font-family-primary font-semibold text-danim-800">
                            {city.all_tours_count} {t('common.tours') || 'Tours'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarCircle size={24} color="#2BA6A4" variant="Bulk" />
                          <span className="font-family-primary font-semibold text-sea-green-600">
                            {t('browseTours.from') || 'From'} ${Math.round(city.min_price)}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/destination/${city.slug}`}
                        className="inline-flex items-center gap-3 bg-sea-green-600 text-white px-8 py-4 rounded-lg hover:bg-danim-700 transition-colors font-family-primary font-semibold shadow-soft hover:shadow-medium"
                      >
                        <Location size={20} color="currentColor" variant="Bulk" />
                        {t('browseTours.exploreCity') || 'Explore City'}
                        <ArrowRight2 size={16} color="currentColor" />
                      </Link>
                    </div>
                  </div>

                  {/* City Tours - Limited to 8 */}
                  <div>
                    <h3 className="font-family-primary text-2xl lg:text-3xl font-bold text-danim-800 mb-6 lg:mb-8 text-center lg:text-left">
                      {t('browseTours.featuredTours') || 'Featured Tours'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                      {city.tours.map((tour) => (
                        <Link 
                          key={tour.id}
                          to={`/destination/${city.slug}/${tour.id}`}
                          className="block hover:transform hover:scale-105 transition-transform duration-300"
                        >
                          <ExcursionCard
                            id={tour.id}
                            title={tour.title}
                            image={tour.cover_image_url}
                            category={tour.category}
                            duration={tour.duration}
                            daysOfWeek={tour.availability || 'Daily'}
                            reviews={tour.reviews_count || 0}
                            originalPrice={parseFloat(tour.price_adult)}
                            price={tour.discount_percentage > 0 ? Math.round(parseFloat(tour.price_adult) * (1 - tour.discount_percentage / 100)) : tour.price_adult}
                            priceUnit={t('common.perPerson') || 'per person'}
                            isFeatured={tour.featured_tag !== null}
                            featuredLabel={getTranslatedFeaturedLabel(tour.featured_tag) || t('common.featured')}
                          />
                        </Link>
                      ))}
                    </div>
                                        
                    {city.all_tours_count > 8 && (
                      <div className="text-center mt-8">
                        <Link
                          to={`/destination/${city.slug}`}
                          className="inline-flex items-center gap-2 bg-white-secondary2 text-danim-800 px-6 py-3 rounded-lg hover:bg-isabelline-600 transition-colors font-family-primary font-semibold shadow-soft"
                        >
                          {t('browseTours.viewAllInCity', { count: city.all_tours_count - 8 }) || 
                           `View ${city.all_tours_count - 8} more tours`}
                          <ArrowRight2 size={16} color="currentColor" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <hr className="border-isabelline-600" />
                </div>
              ))}
            </div>
          ) : (
            /* All Tours View */
            <div>
              <h2 className="font-family-display text-4xl lg:text-5xl font-normal text-center mb-12 lg:mb-16 text-danim-800 tracking-wide">
                {t('browseTours.allTours') || 'ALL AVAILABLE TOURS'}
              </h2>
              {loadingViewChange ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sea-green-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {getAllTours().map((tour) => (
                    <Link 
                      key={tour.id}
                      to={`/destination/${tour.city_slug}/${tour.id}`}
                      className="block hover:transform hover:scale-105 transition-transform duration-300"
                    >
                      <ExcursionCard
                        id={tour.id}
                        title={tour.title}
                        image={tour.cover_image_url}
                        category={tour.category}
                        duration={tour.duration}
                        reviews={tour.reviews_count || 0}
                        originalPrice={parseFloat(tour.price_adult)}
                        price={tour.discount_percentage > 0 ? Math.round(parseFloat(tour.price_adult) * (1 - tour.discount_percentage / 100)) : tour.price_adult}
                        priceUnit={t('common.perPerson') || 'per person'}
                        isFeatured={tour.featured_tag !== null}
                        featuredLabel={getTranslatedFeaturedLabel(tour.featured_tag) || 'Featured'}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseTours;yy