import React, { useState, useEffect } from "react";
import { Filter, ArrowDown2, ArrowUp2, MoneyRecive } from "iconsax-react";
import adminService from "../../services/adminService";

const FilterDropdown = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    cities: [],
    types: [],
    status: [],
    priceRange: [100, 200],
  });

  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    types: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    city: true,
    type: true,
    status: false,
    price: false,
  });

  const statuses = ["Active", "InActive"];

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Get categories for types
      const categoriesResponse = await adminService.getCategories();
      if (categoriesResponse.success) {
        setFilterOptions(prev => ({
          ...prev,
          types: categoriesResponse.data.map(cat => cat.name)
        }));
      }

      // Get cities from dashboard stats or tours
      const dashboardResponse = await adminService.getDashboardStats();
      if (dashboardResponse.success && dashboardResponse.data.recentTours) {
        const cities = [...new Set(dashboardResponse.data.recentTours.map(tour => tour.city_name).filter(Boolean))];
        setFilterOptions(prev => ({
          ...prev,
          cities
        }));
      }
    } catch (error) {
      console.error("Filter options error:", error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === "cities" || type === "types" || type === "status") {
        const currentList = prev[type];
        const newList = currentList.includes(value)
          ? currentList.filter((item) => item !== value)
          : [...currentList, value];
        return { ...prev, [type]: newList };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({
      cities: [],
      types: [],
      status: [],
      priceRange: [100, 200],
    });
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="flex w-52 h-9 px-2 py-1 justify-between items-center bg-white shadow-sm">
        <span className="text-gray-400 text-sm font-normal">Filter</span>
        <Filter size="20" color="#ADADA9" />
      </div>

      <div className="flex flex-col items-end bg-white">
        {/* City Filter */}
        <div className="flex w-52 flex-col items-start">
          <div
            className="flex h-7 px-2 py-1 items-center gap-2 w-full cursor-pointer"
            style={{ backgroundColor: "#F3F3EE" }}
            onClick={() => toggleSection("city")}
          >
            <span className="flex-1 text-gray-400 text-sm font-normal">
              City
            </span>
            {expandedSections.city ? (
              <ArrowUp2 size="20" color="#9E939A" />
            ) : (
              <ArrowDown2 size="20" color="#9E939A" />
            )}
          </div>
          {expandedSections.city && (
            <div className="flex px-0 py-2 flex-col items-start w-full">
              {filterOptions.cities.map((city) => (
                <div
                  key={city}
                  className="flex px-4 py-2 items-center gap-2 w-full cursor-pointer"
                  onClick={() => handleFilterChange("cities", city)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={filters.cities.includes(city)}
                        onChange={() => handleFilterChange("cities", city)}
                        className="w-4 h-4 rounded border border-teal-200 bg-white appearance-none checked:bg-teal-100 checked:border-teal-200"
                        style={{ backgroundColor: "#F3F3EE" }}
                      />
                    </div>
                    <span className="text-gray-400 text-right text-sm font-normal">
                      {city}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex w-52 flex-col items-start">
          <div
            className="flex h-7 px-2 py-1 items-center gap-2 w-full cursor-pointer"
            style={{ backgroundColor: "#F3F3EE" }}
            onClick={() => toggleSection("type")}
          >
            <span className="flex-1 text-gray-400 text-sm font-normal">
              Type
            </span>
            {expandedSections.type ? (
              <ArrowUp2 size="20" color="#9E939A" />
            ) : (
              <ArrowDown2 size="20" color="#9E939A" />
            )}
          </div>
          {expandedSections.type && (
            <div className="flex px-0 py-2 flex-col items-start w-full">
              {filterOptions.types.map((type) => (
                <div
                  key={type}
                  className="flex px-4 py-2 items-center gap-2 w-full cursor-pointer"
                  onClick={() => handleFilterChange("types", type)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type)}
                        onChange={() => handleFilterChange("types", type)}
                        className="w-4 h-4 rounded border border-teal-200 bg-white appearance-none checked:bg-teal-100 checked:border-teal-200"
                        style={{ backgroundColor: "#F3F3EE" }}
                      />
                    </div>
                    <span className="text-gray-400 text-right text-sm font-normal">
                      {type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex w-52 flex-col items-start">
          <div
            className="flex h-7 px-2 py-1 items-center gap-2 w-full cursor-pointer"
            style={{ backgroundColor: "#F3F3EE" }}
            onClick={() => toggleSection("status")}
          >
            <span className="flex-1 text-gray-400 text-sm font-normal">
              Status
            </span>
            {expandedSections.status ? (
              <ArrowUp2 size="20" color="#9E939A" />
            ) : (
              <ArrowDown2 size="20" color="#9E939A" />
            )}
          </div>
          {expandedSections.status && (
            <div className="flex px-0 py-2 flex-col items-start w-full">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="flex px-4 py-2 items-center gap-2 w-full cursor-pointer"
                  onClick={() => handleFilterChange("status", status)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleFilterChange("status", status)}
                        className="w-4 h-4 rounded border border-teal-200 bg-white appearance-none checked:bg-teal-100 checked:border-teal-200"
                        style={{ backgroundColor: "#F3F3EE" }}
                      />
                    </div>
                    <div
                      className={`flex justify-center items-center rounded-full px-2.5 py-0.5 ${
                        status === "Active" ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-center text-xs font-normal ${
                          status === "Active"
                            ? "text-green-800"
                            : "text-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div
          className="flex h-7 px-2 py-1 items-center gap-2 w-full cursor-pointer"
          style={{ backgroundColor: "#F3F3EE" }}
          onClick={() => toggleSection("price")}
        >
          <span className="flex-1 text-gray-400 text-sm font-normal">
            Price
          </span>
          {expandedSections.price ? (
            <ArrowUp2 size="20" color="#9E939A" />
          ) : (
            <ArrowDown2 size="20" color="#9E939A" />
          )}
        </div>

        {/* Price Range Slider */}
        {expandedSections.price && (
          <div className="flex px-4 py-4 flex-col items-center gap-5 border-b border-gray-200 w-full">
            <div className="flex flex-col items-start gap-1 w-full max-w-48">
              <div className="flex justify-center items-center gap-1.5 w-full">
                <span className="text-gray-600 text-xs font-normal">1</span>
                <div className="flex h-1 justify-end items-center flex-1 rounded bg-gray-100 relative">
                  <div
                    className="h-1 rounded absolute"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #2BA6A4",
                      left: "15%",
                      width: "20%",
                    }}
                  />
                  <div
                    className="absolute flex items-center gap-2"
                    style={{ left: "15%" }}
                  >
                    <div
                      className="w-3 h-3 rounded-full border-2 border-teal-700"
                      style={{ background: "#2BA6A4" }}
                    ></div>
                  </div>
                  <div
                    className="absolute flex items-center gap-2"
                    style={{ left: "35%" }}
                  >
                    <div
                      className="w-3 h-3 rounded-full border-2 border-teal-700"
                      style={{ background: "#2BA6A4" }}
                    ></div>
                  </div>
                </div>
                <span className="text-gray-600 text-xs font-normal">1000</span>
              </div>
              <div className="flex px-0 py-0 justify-center items-center gap-2">
                <MoneyRecive size="16" color="#8A8D95" />
                <span className="text-gray-400 text-xs font-normal">
                  From {filters.priceRange[0]}-{filters.priceRange[1]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex px-2 py-2 flex-col items-center gap-2.5 w-full">
          <div className="flex flex-col items-start gap-2.5 w-full">
            <button 
              onClick={applyFilters}
              className="flex w-48 h-9 px-3 py-2 justify-center items-center gap-2 rounded bg-teal-700 hover:bg-teal-800 transition-colors"
            >
              <span className="text-white text-base font-semibold">
                Apply Filter
              </span>
            </button>
            <button
              onClick={clearFilters}
              className="flex w-48 h-9 px-3 py-2 justify-center items-center gap-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              style={{ backgroundColor: "#DDE7E9" }}
            >
              <span
                className="text-base font-semibold"
                style={{ color: "#124645" }}
              >
                Clear Filter
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;