import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExcursionCard from '../components/ExcursionCard';
import publicService from '../services/publicService';
import { useTranslatedFeaturedLabel } from '../hooks/useTranslatedFeaturedLabel';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  
  const query = searchParams.get('q') || '';

  const getTranslatedFeaturedLabel = useTranslatedFeaturedLabel();

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await publicService.searchTours({
        q: query,
        language: 'en',
        limit: 12
      });
      
      if (response.success) {
        setResults(response.data.tours);
        setTotalResults(response.data.pagination.totalItems);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('search.resultsFor')} "{query}"
        </h1>
        <p className="text-gray-600">
          {totalResults} {t('search.resultsFound')}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((tour) => (
          <Link 
            key={tour.id}
            to={`/destination/${tour.city_slug}/${tour.id}`}
            className="block hover:transform hover:scale-105 transition-transform duration-300"
          >
            <ExcursionCard
              id={tour.id}
              title={tour.title || 'Tour Title Not Available'}
              image={tour.cover_image_url}
              category={tour.category || tour.category_type}
              duration={tour.duration || 'Full Day'}
              daysOfWeek={tour.availability || 'Daily'}
              reviews={tour.reviews_count || 0}
              price={parseFloat(tour.price_adult) || 0}
              originalPrice={tour.discount_percentage > 0 ? 
                Math.round(parseFloat(tour.price_adult) / (1 - parseFloat(tour.discount_percentage) / 100)) : null}
              priceUnit={t('common.perPerson') || 'per person'}
              isFeatured={tour.featured_tag !== null && tour.featured_tag !== undefined}
              featuredLabel={getTranslatedFeaturedLabel(tour.featured_tag) || 'Featured'}
            />
          </Link>
        ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('search.noResults')}</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;