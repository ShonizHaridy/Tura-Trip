import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { mockAdminTours, mockFilterOptions } from "../../data/adminMockData";

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

  const statsData = [
    {
      title: "Total Tours",
      value: "542",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.0001 3H9.0001C7.0501 8.84 7.0501 15.16 9.0001 21H8.0001"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 3C15.97 5.92 16.46 8.96 16.46 12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 16V15C5.92 15.97 8.96 16.46 12 16.46"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4998 14.7C19.1298 14.59 18.7098 14.52 18.2498 14.52C16.1798 14.52 14.5098 16.2 14.5098 18.26C14.5098 20.33 16.1898 22 18.2498 22C20.3098 22 21.9897 20.32 21.9897 18.26C21.9897 17.49 21.7597 16.77 21.3597 16.18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.0396 14.8001L18.7896 13.3701"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.0396 14.8003L18.5796 15.8603"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Tour Categories",
      value: "6",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Active Cities",
      value: "3",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
        {/* Stats Cards */}
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
                      Most Viewed Tours
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white w-96">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mr-2"
                    >
                      <path
                        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                        stroke="#B3B3B3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 22L20 20"
                        stroke="#B3B3B3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search"
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4.49967 1.75H15.4997C16.4163 1.75 17.1663 2.5 17.1663 3.41667V5.25C17.1663 5.91667 16.7497 6.75 16.333 7.16667L12.7497 10.3333C12.2497 10.75 11.9163 11.5833 11.9163 12.25V15.8333C11.9163 16.3333 11.583 17 11.1663 17.25L9.99966 18C8.91633 18.6667 7.41633 17.9167 7.41633 16.5833V12.1667C7.41633 11.5833 7.083 10.8333 6.74967 10.4167L3.58301 7.08333C3.16634 6.66667 2.83301 5.91667 2.83301 5.41667V3.5C2.83301 2.5 3.58301 1.75 4.49967 1.75Z"
                        stroke="#9E939A"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.10833 1.75L5 8.33333"
                        stroke="#9E939A"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-600 text-base">Filiter</span>
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
                  {mockAdminTours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-24 h-16 rounded flex items-center justify-center"
                            style={{ backgroundColor: "#ECEFF7" }}
                          >
                            <svg
                              width="24"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                            >
                              <path
                                d="M22.1799 17.2936L19.0499 9.98362C17.9899 7.50362 16.0399 7.40362 14.7299 9.76362L12.8399 13.1736C11.8799 14.9036 10.0899 15.0536 8.84993 13.5036L8.62993 13.2236C7.33993 11.6036 5.51993 11.8036 4.58993 13.6536L2.86993 17.1036C1.65993 19.5036 3.40993 22.3336 6.08993 22.3336H18.8499C21.4499 22.3336 23.1999 19.6836 22.1799 17.2936Z"
                                stroke="#0B101A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.47021 8.3335C9.12707 8.3335 10.4702 6.99035 10.4702 5.3335C10.4702 3.67664 9.12707 2.3335 7.47021 2.3335C5.81336 2.3335 4.47021 3.67664 4.47021 5.3335C4.47021 6.99035 5.81336 8.3335 7.47021 8.3335Z"
                                stroke="#0B101A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-600 text-base">
                            {tour.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.city}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.type}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.priceAdult} $
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-base">
                        {tour.priceChild} $
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
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M13.2603 3.60022L5.05034 12.2902C4.74034 12.6202 4.44034 13.2702 4.38034 13.7202L4.01034 16.9602C3.88034 18.1302 4.72034 18.9302 5.88034 18.7302L9.10034 18.1802C9.55034 18.1002 10.1803 17.7702 10.4903 17.4302L18.7003 8.74022C20.1203 7.24022 20.7603 5.53022 18.5503 3.44022C16.3503 1.37022 14.6803 2.10022 13.2603 3.60022Z"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M11.8896 5.0498C12.3196 7.8098 14.5596 9.9198 17.3396 10.1998"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3 22H21"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="p-1">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.8504 9.14014L18.2004 19.2101C18.0904 20.7801 18.0004 22.0001 15.2104 22.0001H8.79039C6.00039 22.0001 5.91039 20.7801 5.80039 19.2101L5.15039 9.14014"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.3301 16.5H13.6601"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9.5 12.5H14.5"
                                stroke="#8A8D95"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

          {/* Filter Panel */}
          {showFilter && (
            <div className="absolute right-0 top-0 w-52 bg-white border border-gray-200 rounded-md shadow-sm">
              {/* Filter Header */}
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
                    {mockFilterOptions.cities.map((city) => (
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
                    {mockFilterOptions.types.map((type) => (
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

                {/* Price Filter */}
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

                {/* Price Range Slider */}
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

                {/* Filter Actions */}
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
