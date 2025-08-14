// ✅ FIXED - Complete FilterDropdown.jsx
import React, { useState, useEffect } from "react";
import { Filter, ArrowDown2, ArrowUp2, MoneyRecive } from "iconsax-react";
import adminService from "../../services/adminService";

const FilterDropdown = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onClearFilters, 
  currentFilters = {},
  context = "tours"
}) => {
  // ✅ FIXED - Simplified state structure
  const [filters, setFilters] = useState({
    cities: currentFilters.city_id ? [currentFilters.city_id] : [],
    types: currentFilters.category_id ? [currentFilters.category_id] : [],
    status: currentFilters.status ? [currentFilters.status] : [],
    priceRange: [
      currentFilters.min_price || 0,
      currentFilters.max_price || 1000
    ],
  });

  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    types: [],
    priceRange: { min: 0, max: 1000 },
    loading: true
  });

  const [expandedSections, setExpandedSections] = useState({
    city: true,
    type: true,
    status: false,
    price: false,
  });

  const statuses = ["active", "inactive"];

  // ✅ FIXED - Update local filters when currentFilters change
  useEffect(() => {
    setFilters({
      cities: currentFilters.city_id ? [currentFilters.city_id] : [],
      types: currentFilters.category_id ? [currentFilters.category_id] : [],
      status: currentFilters.status ? [currentFilters.status] : [],
      priceRange: [
        currentFilters.min_price || filterOptions.priceRange.min,
        currentFilters.max_price || filterOptions.priceRange.max
      ],
    });
  }, [currentFilters, filterOptions.priceRange]);

  // Keep your existing fetchDynamicFilterOptions function as is...
  useEffect(() => {
    if (isOpen) {
      fetchDynamicFilterOptions();
    }
  }, [isOpen, context]);

  const fetchDynamicFilterOptions = async () => {
    try {
      setFilterOptions(prev => ({ ...prev, loading: true }));
      
      const citiesResponse = await adminService.getCities();
      let cities = [];
      if (citiesResponse.success) {
        cities = citiesResponse.data
          .filter(city => city.is_active && (city.tours_count || city.active_tours_count) > 0)
          .map(city => ({
            id: city.id,
            name: city.name,
            count: city.tours_count || city.active_tours_count || 0
          }))
          .sort((a, b) => b.count - a.count);
      }

      const categoriesResponse = await adminService.getCategories({ 
        active_only: true,
        include_stats: true 
      });
      let types = [];
      if (categoriesResponse.success) {
        types = categoriesResponse.data
          .filter(cat => cat.is_active && (cat.active_tours_count || 0) > 0)
          .map(cat => ({
            id: cat.id,
            name: cat.name,
            count: cat.active_tours_count || 0
          }))
          .sort((a, b) => b.count - a.count);
      }

      let priceRange = { min: 0, max: 1000 };
      if (context === "dashboard") {
        const dashboardResponse = await adminService.getDashboardStats();
        if (dashboardResponse.success && dashboardResponse.data.recentTours) {
          const tours = dashboardResponse.data.recentTours;
          const prices = tours.map(tour => tour.price_adult).filter(price => price > 0);
          if (prices.length > 0) {
            priceRange = {
              min: Math.floor(Math.min(...prices)),
              max: Math.ceil(Math.max(...prices))
            };
          }
        }
      } else {
        const toursResponse = await adminService.getTours({ 
          page: 1, 
          limit: 1000,
          status: 'active' 
        });
        if (toursResponse.success && toursResponse.data.tours) {
          const prices = toursResponse.data.tours
            .map(tour => tour.price_adult)
            .filter(price => price > 0);
          if (prices.length > 0) {
            priceRange = {
              min: Math.floor(Math.min(...prices)),
              max: Math.ceil(Math.max(...prices))
            };
          }
        }
      }

      setFilterOptions({
        cities,
        types,
        priceRange,
        loading: false
      });

      console.log('🎯 Dynamic filter options loaded:', {
        cities: cities.length,
        types: types.length,
        priceRange
      });

    } catch (error) {
      console.error("❌ Error fetching filter options:", error);
      setFilterOptions(prev => ({ ...prev, loading: false }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ✅ FIXED - Simplified filter change handler
  const handleFilterChange = (type, value) => {
    console.log(`🔄 Filter change: ${type} = ${value}`);
    
    setFilters((prev) => {
      const newFilters = { ...prev };
      
      if (type === "cities" || type === "types" || type === "status") {
        const currentList = prev[type];
        const newList = currentList.includes(value)
          ? currentList.filter((item) => item !== value)
          : [...currentList, value];
        newFilters[type] = newList;
      }
      
      console.log('🎯 New filters state:', newFilters);
      return newFilters;
    });
  };

const handlePriceChange = (index, value) => {
  console.log(`💰 Price change: index=${index}, value=${value}`);
  
  setFilters(prev => {
    const newPriceRange = [...prev.priceRange];
    newPriceRange[index] = Number(value);
    
    // Ensure min is not greater than max
    if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[1] = newPriceRange[0];
    }
    if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
      newPriceRange[0] = newPriceRange[1];
    }
    
    console.log('💰 New price range:', newPriceRange);
    return { ...prev, priceRange: newPriceRange };
  });
};

  const clearFilters = () => {
    const clearedFilters = {
      cities: [],
      types: [],
      status: [],
      priceRange: [filterOptions.priceRange.min, filterOptions.priceRange.max],
    };
    setFilters(clearedFilters);
    if (onClearFilters) {
      onClearFilters();
    }
  };

const applyFilters = () => {
  console.log('🎯 Applying dynamic filters:', filters);
  if (onApplyFilters) {
    const formattedFilters = {};
    
    if (filters.cities.length > 0) {
      formattedFilters.city_id = filters.cities[0];
    }
    
    if (filters.types.length > 0) {
      formattedFilters.category_id = filters.types[0];
    }
    
    if (filters.status.length > 0) {
      formattedFilters.status = filters.status[0];
    }
    
    // ✅ FIXED - Always send price range if it's been modified from defaults
    const hasMinPriceFilter = filters.priceRange[0] > filterOptions.priceRange.min;
    const hasMaxPriceFilter = filters.priceRange[1] < filterOptions.priceRange.max;
    
    if (hasMinPriceFilter || hasMaxPriceFilter) {
      if (hasMinPriceFilter) {
        formattedFilters.min_price = filters.priceRange[0];
      }
      if (hasMaxPriceFilter) {
        formattedFilters.max_price = filters.priceRange[1];
      }
    }
    
    console.log('📤 Sending filters to backend:', formattedFilters);
    console.log('💰 Price range details:', {
      current: filters.priceRange,
      defaults: [filterOptions.priceRange.min, filterOptions.priceRange.max],
      hasMinFilter: hasMinPriceFilter,
      hasMaxFilter: hasMaxPriceFilter
    });
    
    onApplyFilters(formattedFilters);
  }
  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex w-full h-9 px-3 py-2 justify-between items-center bg-white shadow-sm border-b">
        <span className="text-gray-600 text-sm font-medium">Filter Tours</span>
        <Filter size="18" color="#6B7280" />
      </div>

      <div className="flex flex-col bg-white">
        {filterOptions.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
            <span className="ml-2 text-gray-500 text-sm">Loading options...</span>
          </div>
        ) : (
          <>
            {/* ✅ FIXED - Cities Filter */}
            <div className="border-b border-gray-100">
              <div
                className="flex h-8 px-3 py-2 items-center gap-2 w-full cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection("city")}
              >
                <span className="flex-1 text-gray-700 text-sm font-medium">
                  Cities ({filterOptions.cities.length})
                </span>
                {expandedSections.city ? (
                  <ArrowUp2 size="16" color="#6B7280" />
                ) : (
                  <ArrowDown2 size="16" color="#6B7280" />
                )}
              </div>
              {expandedSections.city && (
                <div className="max-h-40 overflow-y-auto">
                  {filterOptions.cities.map((city) => (
                    <div
                      key={city.id}
                      className="flex px-4 py-2 items-center gap-3 w-full hover:bg-gray-50"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.cities.includes(city.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleFilterChange("cities", city.id);
                          }}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                      </div>
                      <div 
                        className="flex-1 flex justify-between items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("cities", city.id);
                        }}
                      >
                        <span className="text-gray-700 text-sm">{city.name}</span>
                        <span className="text-gray-400 text-xs">({city.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ FIXED - Categories Filter */}
            <div className="border-b border-gray-100">
              <div
                className="flex h-8 px-3 py-2 items-center gap-2 w-full cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection("type")}
              >
                <span className="flex-1 text-gray-700 text-sm font-medium">
                  Categories ({filterOptions.types.length})
                </span>
                {expandedSections.type ? (
                  <ArrowUp2 size="16" color="#6B7280" />
                ) : (
                  <ArrowDown2 size="16" color="#6B7280" />
                )}
              </div>
              {expandedSections.type && (
                <div className="max-h-40 overflow-y-auto">
                  {filterOptions.types.map((type) => (
                    <div
                      key={type.id}
                      className="flex px-4 py-2 items-center gap-3 w-full hover:bg-gray-50"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleFilterChange("types", type.id);
                          }}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                      </div>
                      <div 
                        className="flex-1 flex justify-between items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("types", type.id);
                        }}
                      >
                        <span className="text-gray-700 text-sm">{type.name}</span>
                        <span className="text-gray-400 text-xs">({type.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter - Keep as is but fix the structure */}
            <div className="border-b border-gray-100">
              <div
                className="flex h-8 px-3 py-2 items-center gap-2 w-full cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection("status")}
              >
                <span className="flex-1 text-gray-700 text-sm font-medium">Status</span>
                {expandedSections.status ? (
                  <ArrowUp2 size="16" color="#6B7280" />
                ) : (
                  <ArrowDown2 size="16" color="#6B7280" />
                )}
              </div>
              {expandedSections.status && (
                <div className="py-2">
                  {statuses.map((status) => (
                    <div
                      key={status}
                      className="flex px-4 py-2 items-center gap-3 w-full hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleFilterChange("status", status);
                        }}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("status", status);
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter - Keep as is */}
            <div className="border-b border-gray-100">
              <div
                className="flex h-8 px-3 py-2 items-center gap-2 w-full cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection("price")}
              >
                <span className="flex-1 text-gray-700 text-sm font-medium">Price Range</span>
                {expandedSections.price ? (
                  <ArrowUp2 size="16" color="#6B7280" />
                ) : (
                  <ArrowDown2 size="16" color="#6B7280" />
                )}
              </div>
              {expandedSections.price && (
                <div className="px-4 py-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <MoneyRecive size="16" color="#6B7280" />
                    <span className="text-gray-600 text-sm">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Min Price
                      </label>
                      <input
                        type="range"
                        min={filterOptions.priceRange.min}
                        max={filterOptions.priceRange.max}
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min={filterOptions.priceRange.min}
                        max={filterOptions.priceRange.max}
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Max Price
                      </label>
                      <input
                        type="range"
                        min={filterOptions.priceRange.min}
                        max={filterOptions.priceRange.max}
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min={filterOptions.priceRange.min}
                        max={filterOptions.priceRange.max}
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 p-3">
          <button 
            onClick={applyFilters}
            disabled={filterOptions.loading}
            className="w-full py-2 px-4 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            disabled={filterOptions.loading}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;