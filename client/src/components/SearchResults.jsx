import React from 'react';
import { useTranslation } from 'react-i18next';
import { default as Link } from './SmartLink';

const SearchResults = ({ suggestions, onSuggestionClick, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 text-sm mt-2">{t('common.searching')}</p>
        </div>
      </div>
    );
  }

  if (!suggestions || (!suggestions.cities?.length && !suggestions.tours?.length)) {
    return null;
  }

  const totalResults = (suggestions.cities?.length || 0) + (suggestions.tours?.length || 0);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
      {/* Cities Section */}
      {suggestions.cities?.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            {t('common.destinations')}
          </div>
          {suggestions.cities.map((city) => (
            <Link
              key={`city-${city.id}`}
              to={`/destination/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onSuggestionClick}
              className="block px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
            >
              <img
                src={city.image_url || '/placeholder.jpg'}
                alt={city.name}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{city.name}</div>
                <div className="text-xs text-gray-500">
                  {city.tours_count} {t('common.tours')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Tours Section */}
      {suggestions.tours?.length > 0 && (
        <div>
          <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            {t('common.tours')}
          </div>
          {suggestions.tours.map((tour) => (
            <Link
              key={`tour-${tour.id}`}
              to={`/destination/${tour.city_name?.toLowerCase().replace(/\s+/g, '-')}/${tour.id}`}
              onClick={onSuggestionClick}
              className="block px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
            >
              <img
                src={tour.image_url || '/placeholder.jpg'}
                alt={tour.name}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{tour.name}</div>
                <div className="text-xs text-gray-500">
                  {tour.city_name} • {tour.category_name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Show More Results */}
      {totalResults >= 6 && (
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={onSuggestionClick}
            className="w-full text-center text-sm text-teal-600 hover:text-teal-800 font-medium"
          >
            {t('common.showMoreResults')} →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;