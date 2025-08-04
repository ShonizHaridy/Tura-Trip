import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";
import { GlobalRefresh, Category2, TickCircle, Add, SearchNormal1, Filter, Image, Edit2, Trash } from 'iconsax-react'

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cities: [],
    types: [],
    priceMin: 1,
    priceMax: 1000,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getDashboardStats();
      
      if (response.success) {
        setDashboardData(response.data);
        console.log(response.data);
      } else {
        setError(response.message || "Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
      setError(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Get filter options from API data - DESIGN PRESERVED
  const getFilterOptions = () => {
    if (!dashboardData) return { cities: [], types: [] };
    const cities = [...new Set(dashboardData.recentTours?.map(tour => tour.city_name).filter(Boolean))];
    const types = [...new Set(dashboardData.recentTours?.map(tour => tour.category_name).filter(Boolean))];
    return { cities, types };
  };

  const filterOptions = getFilterOptions();

  const statsData = [
    {
      title: "Total Tours",
      value: loading ? "..." : (dashboardData?.totalTours || "0"),
      icon: (
        <GlobalRefresh size="24" color="#FFFFFF" />
      ),
    },
    {
      title: "Tour Categories",
      value: loading ? "..." : (dashboardData?.totalCategories || "0"),
      icon: (
        <Category2 size="24" color="#ffffff" />
      ),
    },
    {
      title: "Active Cities",
      value: loading ? "..." : (dashboardData?.totalCities || "0"),
      icon: (
        <TickCircle size="24" color="#FFFFFF" />
      ),
    },
  ];

  const handleFilterToggle = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      cities: [],
      types: [],
      priceMin: 1,
      priceMax: 1000,
    });
  };

  // Filter tours but preserve original design
  const getDisplayTours = () => {
    if (!dashboardData?.recentTours) return [];
    return dashboardData.recentTours;
  };

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-5 p-6">
        <div
          className="p-3 rounded-md flex items-center justify-center"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #2BA6A4",
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium leading-5">{title}</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-semibold text-gray-900 leading-8">
              {value}
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3" style={{ backgroundColor: "#F7F7F4" }}>
        <span
          style={{ color: "#2BA6A4" }}
          className="text-sm font-medium leading-5"
        >
          View all
        </span>
      </div>
    </div>
  );

  return (
    <AdminLayout activeItem="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards - DESIGN PRESERVED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Add New Tour Button - DESIGN PRESERVED */}
        <div className="flex justify-end">
          <button
            onClick={() => (window.location.href = "/admin/tours/add")}
            className="flex items-center gap-2 px-3 py-2 rounded"
            style={{ backgroundColor: "#1F7674", height: "40px" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 8H12"
                stroke="#EAF6F6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12V4"
                stroke="#EAF6F6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-base font-semibold"
              style={{ color: "#EAF6F6" }}
            >
              Add New Tour
            </span>
          </button>
        </div>

        {/* Main Content - DESIGN PRESERVED */}
        <div className="relative">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header - DESIGN PRESERVED */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 h-10">
                  <div className="flex flex-col justify-center items-start h-10">
                    <h2
                      className="text-2xl font-medium leading-normal"
                      style={{ color: "#124645" }}
                    >
                      Most Viewed Tours
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Search - DESIGN PRESERVED */}
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white w-96">
                    <SearchNormal1 size="24" color="#B3B3B3" className="mr-2"/>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none text-gray-400 text-base"
                    />
                  </div>
                  {/* Filter Button - DESIGN PRESERVED */}
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-md bg-white shadow-sm w-24"
                  >
                    <Filter size="20" color="#9E939A" />
                    <span className="text-gray-600 text-base">Filiter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table - DESIGN PRESERVED, ONLY DATA CHANGED */}
            <div className="overflow-hidden">
              <table className="w-full">
                <thead style={{ backgroundColor: "#ECEFF7" }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900">
                      Tour Title
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900">
                      City
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900">
                      Price/Adult
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900">
                      Price/Child
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getDisplayTours().map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-24 h-16 rounded flex items-center justify-center"
                            style={{ backgroundColor: "#ECEFF7" }}
                          >
                            {tour.cover_image_url ? (
                              <img 
                                src={tour.cover_image_url} 
                                alt="Tour"
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <Image size="24" color="#0B101A" style={{display: tour.cover_image_url ? 'none' : 'block'}} />
                          </div>
                          <span className="text-gray-600 text-base">
                            {tour.title || `Tour #${tour.id}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.city_name}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.category_name}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.price_adult} $
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.price_child} $
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="px-2.5 py-0.5 rounded-lg text-xs"
                          style={{
                            backgroundColor: "#D1FAE5",
                            color: "#065F46",
                          }}
                        >
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <button className="p-1">
                            <Edit2 size="24" color="#8A8D95" />
                          </button>
                          <button className="p-1">
                            <Trash size="24" color="#8A8D95" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - DESIGN PRESERVED */}
            <div className="border-t border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-900 text-base">
                  Showing 1 to 10 of 99
                </span>
                <div className="flex items-center">
                  <button className="p-2 border border-gray-400 rounded-l-md bg-white">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                        fill="#8A8D95"
                      />
                    </svg>
                  </button>
                  {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 border border-gray-400 text-base ${
                        page === 1
                          ? "bg-teal-100 border-teal-600 text-teal-800"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="p-2 border border-gray-400 rounded-r-md bg-white">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                        fill="#8A8D95"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Panel - EXACT ORIGINAL DESIGN PRESERVED */}
          {showFilter && (
            <div className="absolute right-0 top-0 w-52 bg-white border border-gray-200 rounded-md shadow-sm">
              {/* Filter Header - ORIGINAL DESIGN */}
              <div className="flex items-center justify-between px-2 py-1 bg-white shadow-sm h-10">
                <span className="text-gray-500 text-sm">Filiter</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4.49967 1.75H15.4997C16.4163 1.75 17.1663 2.5 17.1663 3.41667V5.25C17.1663 5.91667 16.7497 6.75 16.333 7.16667L12.7497 10.3333C12.2497 10.75 11.9163 11.5833 11.9163 12.25V15.8333C11.9163 16.3333 11.583 17 11.1663 17.25L9.99966 18C8.91633 18.6667 7.41633 17.9167 7.41633 16.5833V12.1667C7.41633 11.5833 7.083 10.8333 6.74967 10.4167L3.58301 7.08333C3.16634 6.66667 2.83301 5.91667 2.83301 5.41667V3.5C2.83301 2.5 3.58301 1.75 4.49967 1.75Z"
                    stroke="#ADADA9"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="bg-white">
                {/* City Filter - ORIGINAL DESIGN */}
                <div>
                  <div
                    className="flex items-center justify-between px-2 py-1 h-7"
                    style={{ backgroundColor: "#F3F3EE" }}
                  >
                    <span className="text-gray-600 text-sm flex-1">City</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6004 12.5415L11.167 7.1082C10.5254 6.46654 9.47538 6.46654 8.83372 7.1082L3.40039 12.5415"
                        stroke="#9E939A"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="py-2">
                    {filterOptions.cities.map((city) => (
                      <div
                        key={city}
                        className="flex items-center gap-2 px-4 py-2"
                      >
                        <div
                          className="w-4 h-4 rounded border"
                          style={{
                            borderColor: "#9ED6D5",
                            backgroundColor: "#F3F3EE",
                          }}
                        ></div>
                        <span className="text-gray-600 text-sm">{city}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter - ORIGINAL DESIGN */}
                <div>
                  <div
                    className="flex items-center justify-between px-2 py-1 h-7"
                    style={{ backgroundColor: "#F3F3EE" }}
                  >
                    <span className="text-gray-600 text-sm flex-1">Type</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6004 12.5415L11.167 7.1082C10.5254 6.46654 9.47538 6.46654 8.83372 7.1082L3.40039 12.5415"
                        stroke="#9E939A"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="py-2">
                    {filterOptions.types.map((type) => (
                      <div
                        key={type}
                        className="flex items-center gap-2 px-4 py-2"
                      >
                        <div
                          className="w-4 h-4 rounded border"
                          style={{
                            borderColor: "#9ED6D5",
                            backgroundColor: "#F3F3EE",
                          }}
                        ></div>
                        <span className="text-gray-600 text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter - ORIGINAL DESIGN */}
                <div
                  className="flex items-center justify-between px-2 py-1 h-7"
                  style={{ backgroundColor: "#F3F3EE" }}
                >
                  <span className="text-gray-600 text-sm flex-1">Price</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M16.6004 7.4585L11.167 12.8918C10.5254 13.5335 9.47538 13.5335 8.83372 12.8918L3.40039 7.4585"
                      stroke="#9E939A"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Price Range Slider - ORIGINAL DESIGN */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-xs">1</span>
                    <span className="text-gray-600 text-xs">1000</span>
                  </div>
                  <div
                    className="h-1 rounded"
                    style={{ backgroundColor: "#F3F4F6" }}
                  >
                    <div
                      className="h-1 rounded relative"
                      style={{
                        width: "50%",
                        marginLeft: "20%",
                        backgroundColor: "#2BA6A4",
                      }}
                    >
                      <div
                        className="absolute -left-1.5 -top-1.5 w-4 h-4 rounded-full border-2"
                        style={{
                          backgroundColor: "#2BA6A4",
                          borderColor: "#1F7674",
                        }}
                      ></div>
                      <div
                        className="absolute -right-1.5 -top-1.5 w-4 h-4 rounded-full border-2"
                        style={{
                          backgroundColor: "#2BA6A4",
                          borderColor: "#1F7674",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.78125 9.55307C5.78125 10.4131 6.44125 11.1064 7.26125 11.1064H8.93458C9.64792 11.1064 10.2279 10.4997 10.2279 9.75307C10.2279 8.93973 9.87458 8.65307 9.34792 8.4664L6.66125 7.53307C6.13458 7.3464 5.78125 7.05973 5.78125 6.2464C5.78125 5.49973 6.36125 4.89307 7.07458 4.89307H8.74792C9.56792 4.89307 10.2279 5.5864 10.2279 6.4464"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 4V12"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.99967 14.6668C11.6816 14.6668 14.6663 11.6821 14.6663 8.00016C14.6663 4.31826 11.6816 1.3335 7.99967 1.3335C4.31778 1.3335 1.33301 4.31826 1.33301 8.00016C1.33301 11.6821 4.31778 14.6668 7.99967 14.6668Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-600 text-xs">From 100-200</span>
                  </div>
                </div>

                {/* Filter Actions - ORIGINAL DESIGN */}
                <div className="p-2 space-y-2.5">
                  <button
                    className="w-full h-10 px-3 rounded text-white font-semibold text-base"
                    style={{ backgroundColor: "#1F7674" }}
                  >
                    Apply Filiter
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full h-10 px-3 rounded font-semibold text-base"
                    style={{
                      backgroundColor: "#DDE7E9",
                      color: "#124645",
                    }}
                  >
                    Clear Filiter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;