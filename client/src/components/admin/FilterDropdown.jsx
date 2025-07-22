import React, { useState } from "react";
import { mockFilterOptions } from "../../data/adminMockData";

const FilterDropdown = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    cities: [],
    types: [],
    status: [],
    priceRange: [100, 200],
  });

  const [expandedSections, setExpandedSections] = useState({
    city: true,
    type: true,
    status: false,
    price: false,
  });

  const cities = ["Hurghada", "Marsa Alam", "Sharm El-Sheikh"];
  const types = [
    "Sea Excursions",
    "Historical Cities",
    "Individual",
    "Safari and Adventure",
    "Entertainment and SPA",
    "Transfer",
  ];
  const statuses = ["Active", "InActive"];

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

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="flex w-52 h-9 px-2 py-1 justify-between items-center bg-white shadow-sm">
        <span className="text-gray-400 text-sm font-normal">Filter</span>
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none">
          <path
            d="M4.49967 1.75H15.4997C16.4163 1.75 17.1663 2.5 17.1663 3.41667V5.25C17.1663 5.91667 16.7497 6.75 16.333 7.16667L12.7497 10.3333C12.2497 10.75 11.9163 11.5833 11.9163 12.25V15.8333C11.9163 16.3333 11.583 17 11.1663 17.25L9.99966 18C8.91633 18.6667 7.41633 17.9167 7.41633 16.5833V12.1667C7.41633 11.5833 7.083 10.8333 6.74967 10.4167L3.58301 7.08333C3.16634 6.66667 2.83301 5.91667 2.83301 5.41667V3.5C2.83301 2.5 3.58301 1.75 4.49967 1.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.10833 1.75L5 8.33333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col items-end bg-white">
        {/* City Filter */}
        <div className="flex w-52 flex-col items-start">
          <div
            className="flex h-7 px-2 py-1 items-center gap-2 w-full"
            style={{ backgroundColor: "#F3F3EE" }}
          >
            <span className="flex-1 text-gray-400 text-sm font-normal">
              City
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.city ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="none"
              onClick={() => toggleSection("city")}
            >
              <path
                d="M16.6004 12.5418L11.167 7.10845C10.5254 6.46678 9.47538 6.46678 8.83372 7.10845L3.40039 12.5418"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {expandedSections.city && (
            <div className="flex px-0 py-2 flex-col items-start w-full">
              {cities.map((city) => (
                <div
                  key={city}
                  className="flex px-4 py-2 items-center gap-2 w-full"
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
            className="flex h-7 px-2 py-1 items-center gap-2 w-full"
            style={{ backgroundColor: "#F3F3EE" }}
          >
            <span className="flex-1 text-gray-400 text-sm font-normal">
              Type
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.type ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="none"
              onClick={() => toggleSection("type")}
            >
              <path
                d="M16.6004 12.5418L11.167 7.10845C10.5254 6.46678 9.47538 6.46678 8.83372 7.10845L3.40039 12.5418"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {expandedSections.type && (
            <div className="flex px-0 py-2 flex-col items-start w-full">
              {types.map((type) => (
                <div
                  key={type}
                  className="flex px-4 py-2 items-center gap-2 w-full"
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
            className="flex h-7 px-2 py-1 items-center gap-2 w-full"
            style={{ backgroundColor: "#F3F3EE" }}
          >
            <span className="flex-1 text-gray-400 text-sm font-normal">
              Status
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.status ? "" : "rotate-180"}`}
              viewBox="0 0 20 20"
              fill="none"
              onClick={() => toggleSection("status")}
            >
              <path
                d="M16.6004 7.45825L11.167 12.8916C10.5254 13.5333 9.47538 13.5333 8.83372 12.8916L3.40039 7.45825"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {expandedSections.status && (
            <div className="flex px-0 py-2 flex-col items-start w-full">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="flex px-4 py-2 items-center gap-2 w-full"
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
          className="flex h-7 px-2 py-1 items-center gap-2 w-full"
          style={{ backgroundColor: "#F3F3EE" }}
        >
          <span className="flex-1 text-gray-400 text-sm font-normal">
            Price
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.price ? "" : "rotate-180"}`}
            viewBox="0 0 20 20"
            fill="none"
            onClick={() => toggleSection("price")}
          >
            <path
              d="M16.6004 7.45825L11.167 12.8916C10.5254 13.5333 9.47538 13.5333 8.83372 12.8916L3.40039 7.45825"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Price Range Slider */}
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
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.78125 9.55331C5.78125 10.4133 6.44125 11.1066 7.26125 11.1066H8.93458C9.64792 11.1066 10.2279 10.5 10.2279 9.75331C10.2279 8.93998 9.87458 8.65331 9.34792 8.46664L6.66125 7.53331C6.13458 7.34664 5.78125 7.05998 5.78125 6.24664C5.78125 5.49998 6.36125 4.89331 7.07458 4.89331H8.74792C9.56792 4.89331 10.2279 5.58664 10.2279 6.44664"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 4V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.99967 14.6666C11.6816 14.6666 14.6663 11.6818 14.6663 7.99992C14.6663 4.31802 11.6816 1.33325 7.99967 1.33325C4.31778 1.33325 1.33301 4.31802 1.33301 7.99992C1.33301 11.6818 4.31778 14.6666 7.99967 14.6666Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-gray-400 text-xs font-normal">
                From 100-200
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex px-2 py-2 flex-col items-center gap-2.5 w-full">
          <div className="flex flex-col items-start gap-2.5 w-full">
            <button className="flex w-48 h-9 px-3 py-2 justify-center items-center gap-2 rounded bg-teal-700 hover:bg-teal-800 transition-colors">
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
