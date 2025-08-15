// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DynamicPagination from "../../components/admin/DynamicPagination"; // ✅ Import DynamicPagination
import adminService from "../../services/adminService";
import { GlobalRefresh, Category2, TickCircle, Add, SearchNormal1, Filter, Image, Edit2, Trash } from 'iconsax-react'
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cities: [],
    types: [],
    priceMin: 1,
    priceMax: 1000,
  });
  
  // ✅ Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginatedTours, setPaginatedTours] = useState([]);
  const itemsPerPage = 6;

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ✅ Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Fetch paginated data when page or search changes
  useEffect(() => {
    if (dashboardData?.recentTours) {
      fetchPaginatedTours();
    }
  }, [currentPage, searchTerm, selectedFilters, dashboardData]);

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

  // ✅ NEW: Function to handle client-side pagination and filtering
  const fetchPaginatedTours = () => {
    if (!dashboardData?.recentTours) return;

    let filtered = [...dashboardData.recentTours];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(tour => 
        tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.city_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply city filters
    if (selectedFilters.cities.length > 0) {
      filtered = filtered.filter(tour => 
        selectedFilters.cities.includes(tour.city_name)
      );
    }
    
    // Apply type filters
    if (selectedFilters.types.length > 0) {
      filtered = filtered.filter(tour => 
        selectedFilters.types.includes(tour.category_name)
      );
    }

    // Apply price filters
    if (selectedFilters.priceMin || selectedFilters.priceMax) {
      filtered = filtered.filter(tour => 
        tour.price_adult >= (selectedFilters.priceMin || 0) &&
        tour.price_adult <= (selectedFilters.priceMax || Infinity)
      );
    }

    // Update total items
    setTotalItems(filtered.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    setPaginatedTours(paginatedData);
  };

  // Get filter options from API data
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
      link: "/admin/tours"
    },
    {
      title: "Tour Categories",
      value: loading ? "..." : (dashboardData?.totalCategories || "0"),
      icon: (
        <Category2 size="24" color="#ffffff" />
      ),
      link: "/admin/tours"
    },
    {
      title: "Active Cities",
      value: loading ? "..." : (dashboardData?.totalCities || "0"),
      icon: (
        <TickCircle size="24" color="#FFFFFF" />
      ),
      link: "/admin/cities"
    },
  ];

  const handleFilterToggle = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
    setCurrentPage(1); // ✅ Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSelectedFilters({
      cities: [],
      types: [],
      priceMin: 1,
      priceMax: 1000,
    });
    setCurrentPage(1); // ✅ Reset to first page when clearing filters
  };

  const StatCard = ({ title, value, icon, link }) => (
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
        <button
          onClick={() => navigate(`${link}`)}
          style={{ color: "#2BA6A4" }}
          className="text-sm cursor-pointer hover:underline font-medium leading-5"
        >
          View all
        </button>
      </div>
    </div>
  );

  // ✅ Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <AdminLayout activeItem="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon} 
              link={stat.link}
            />
          ))}
        </div>

        {/* Add New Tour Button */}
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

        {/* Main Content */}
        <div className="relative">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 h-10">
                  <div className="flex flex-col justify-center items-start h-10">
                    <h2
                      className="text-2xl font-medium leading-normal"
                      style={{ color: "#124645" }}
                    >
                      Recent Tours
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Search Input */}
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white w-96">
                    <SearchNormal1 size="24" color="#B3B3B3" className="mr-2"/>
                    <input
                      type="text"
                      placeholder="Search tours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none text-gray-400 text-base"
                    />
                  </div>
                  {/* Filter Button */}
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-md bg-white shadow-sm w-24"
                  >
                    <Filter size="20" color="#9E939A" />
                    <span className="text-gray-600 text-base">Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
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
                  {/* ✅ Use paginated tours */}
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        Loading tours...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : paginatedTours.length > 0 ? (
                    paginatedTours.map((tour) => (
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
                            <button 
                              onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                              className="p-1"
                            >
                              <Edit2 size="24" color="#8A8D95" />
                            </button>
                            <button className="p-1">
                              <Trash size="24" color="#8A8D95" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? `No tours found for "${searchTerm}"` : "No tours available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Replace static pagination with DynamicPagination */}
            {!loading && !error && totalItems > 0 && (
              <DynamicPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>

          {/* Filter Panel - Keep your existing filter panel code */}
          {showFilter && (
            <div className="absolute right-0 top-0 w-52 bg-white border border-gray-200 rounded-md shadow-sm">
              {/* Filter Header */}
              <div className="flex items-center justify-between px-2 py-1 bg-white shadow-sm h-10">
                <span className="text-gray-500 text-sm">Filter</span>
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
                {/* City Filter */}
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
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                        onClick={() => handleFilterToggle('cities', city)}
                      >
                        <div
                          className={`w-4 h-4 rounded border ${
                            selectedFilters.cities.includes(city)
                              ? 'bg-teal-500 border-teal-500'
                              : 'border-gray-300'
                          }`}
                        />
                        <span className="text-gray-600 text-sm">{city}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
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
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                        onClick={() => handleFilterToggle('types', type)}
                      >
                        <div
                          className={`w-4 h-4 rounded border ${
                            selectedFilters.types.includes(type)
                              ? 'bg-teal-500 border-teal-500'
                              : 'border-gray-300'
                          }`}
                        />
                        <span className="text-gray-600 text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="p-2 space-y-2.5">
                  <button
                    onClick={() => {
                      setCurrentPage(1); // Reset page when applying filters
                      setShowFilter(false);
                    }}
                    className="w-full h-10 px-3 rounded text-white font-semibold text-base"
                    style={{ backgroundColor: "#1F7674" }}
                  >
                    Apply Filter
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full h-10 px-3 rounded font-semibold text-base"
                    style={{
                      backgroundColor: "#DDE7E9",
                      color: "#124645",
                    }}
                  >
                    Clear Filter
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