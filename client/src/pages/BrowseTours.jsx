// src/pages/BrowseTours.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from '../hooks/useSmartNavigation'; // ← Add useLocation
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
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(location.state?.viewMode || 'cities'); // 'cities' or 'tours'

const getTranslatedFeaturedLabel = useTranslatedFeaturedLabel();


  useEffect(() => {
    fetchBrowseData();
  }, [i18n.language]);

  const fetchBrowseData = async (includeAllTours = false) => {
    try {
      const loadingState = includeAllTours ? setLoadingAllTours : setLoading;
      loadingState(true);
      
      const response = await publicService.getBrowseToursData(i18n.language, includeAllTours);
      if (response.success) {
        setBrowseData(response.data);
        if (includeAllTours) {
          setAllToursLoaded(true);
        }
        console.log('Browse data loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching browse data:', error);
    } finally {
      const loadingState = includeAllTours ? setLoadingAllTours : setLoading;
      loadingState(false);
    }
  };


//   const getAllTours = () => {
//     if (!browseData) return [];
//     return browseData.cities.flatMap(city => 
//       city.tours.map(tour => ({ ...tour, city_slug: city.slug }))
//     );
//   };
  const getAllTours = () => {
    if (!browseData) return [];
    
    return browseData.cities.flatMap(city => 
      city.tours.map(tour => ({
        ...tour,
        city_slug: city.slug, // Add city_slug from parent city
        city_name: city.city_name // Ensure city_name is available
      }))
    );
  };

  const handleViewModeChange = async (mode) => {
    setViewMode(mode);
    
    // If switching to "tours" view and we haven't loaded all tours yet
    if (mode === 'tours' && !allToursLoaded && !loadingAllTours) {
      await fetchBrowseData(true); // Fetch all tours
    }
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
                {browseData.statistics.total_cities}
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
                {browseData.statistics.total_tours}
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
                ${Math.round(browseData.statistics.price_range.min)}-${Math.round(browseData.statistics.price_range.max)}
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
                onClick={() => setViewMode('cities')}
                className={`px-6 lg:px-8 py-3 rounded-lg font-family-primary font-semibold transition-all duration-200 ${
                  viewMode === 'cities'
                    ? 'bg-danim text-white shadow-soft'
                    : 'text-danim-800 hover:bg-danim-50'
                }`}
              >
                {t('browseTours.viewByCities') || 'View by Cities'}
              </button>
              <button
                onClick={() => setViewMode('tours')}
                className={`px-6 lg:px-8 py-3 rounded-lg font-family-primary font-semibold transition-all duration-200 ${
                  viewMode === 'tours'
                    ? 'bg-danim text-white shadow-soft'
                    : 'text-danim-800 hover:bg-danim-50'
                }`}
              >
                {t('browseTours.viewAllTours') || 'All Tours'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {viewMode === 'cities' ? (
            /* Cities View */
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
                            {city.total_tours} {t('common.tours') || 'Tours'}
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

                  {/* City Tours */}
                  <div>
                    <h3 className="font-family-primary text-2xl lg:text-3xl font-bold text-danim-800 mb-6 lg:mb-8 text-center lg:text-left">
                      {t('browseTours.featuredTours') || 'Featured Tours'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {city.tours.map((tour) => (
                        <Link 
                        key={tour.id}
                        to={`/destination/${city.slug}/${tour.id}`}  // ✅ Use tour.city_slug
                        className="block hover:transform hover:scale-105 transition-transform duration-300"
                        >
                        <ExcursionCard
                            id={tour.id}
                            title={tour.title}
                            image={tour.cover_image_url}
                            category={tour.category}
                            duration={tour.duration}
                            daysOfWeek={tour.availability || 'Daily'}  // Add this
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
                                        
                    {city.all_tours_count > 6 && (
                      <div className="text-center mt-8">
                        <Link
                          to={`/destination/${city.slug}`}
                          className="inline-flex items-center gap-2 bg-white-secondary2 text-danim-800 px-6 py-3 rounded-lg hover:bg-isabelline-600 transition-colors font-family-primary font-semibold shadow-soft"
                        >
                          {t('browseTours.viewAllInCity', { count: city.all_tours_count - 6 }) || 
                           `View ${city.all_tours_count - 6} more tours`}
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseTours;