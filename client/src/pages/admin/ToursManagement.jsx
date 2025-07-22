// src/pages/admin/ToursManagement.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import ToursTable from "../../components/admin/ToursTable";
import TourCategoriesTable from "../../components/admin/TourCategoriesTable";
import AddCategoryModal from "../../components/admin/AddCategoryModal";
import EditCategoryModal from "../../components/admin/EditCategoryModal";
import FilterDropdown from "../../components/admin/FilterDropdown";

const ToursManagement = () => {
  const navigate = useNavigate();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);

  const stats = [
    {
      title: "Total Tours",
      value: "82",
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
            d="M20.0396 14.8L18.5796 15.86"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Active Tours",
      value: "58",
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
    {
      title: "Deactivated Tours",
      value: "24",
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
            d="M9.16992 14.8299L14.8299 9.16992"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.8299 14.8299L9.16992 9.16992"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const StatsCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center gap-5 p-6">
        <div
          className="p-3 rounded-md"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #2BA6A4",
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="px-4 py-4" style={{ backgroundColor: "#F7F7F4" }}>
        <span
          style={{ color: "#2BA6A4" }}
          className="text-sm cursor-pointer hover:underline font-medium"
        >
          View all
        </span>
      </div>
    </div>
  );

  return (
    <AdminLayout activeItem="Tours">
      <div className="flex flex-col items-end gap-6 max-w-7xl mx-auto">
        {/* Tours Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full">
          {/* Header */}
          <div className="flex items-center justify-end gap-2.5 mb-4">
            <div className="flex h-10 flex-col justify-center items-start">
              <h1 className="text-2xl font-medium" style={{ color: "#124645" }}>
                All Tours
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex justify-end items-center gap-2 flex-1">
                <div className="flex justify-between items-center flex-1">
                  <div className="flex justify-end items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {/* Search Input */}
                      <div className="flex flex-col items-end gap-2 w-96">
                        <div className="flex justify-end items-center gap-2 flex-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 22L20 20"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 text-gray-400 text-base font-normal outline-none border-none"
                          />
                        </div>
                      </div>
                      {/* Filter Button */}
                      <div className="relative">
                        <button
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className="flex items-center w-24 justify-center gap-2 py-2 px-4 rounded border border-gray-200 bg-white shadow-sm"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
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
                          <span className="text-gray-400 text-base font-normal">
                            Filter
                          </span>
                        </button>
                        {isFilterOpen && (
                          <FilterDropdown
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tours Table */}
          <ToursTable />
        </div>

        {/* Stats Cards */}
        <div className="flex items-center gap-6 w-full">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/tours/add")}
            className="flex h-10 items-center gap-2 px-3 py-2 rounded bg-teal-700 text-white hover:bg-teal-800 transition-colors"
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
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex h-10 items-center gap-2 px-3 py-2 rounded bg-teal-700 text-white hover:bg-teal-800 transition-colors"
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
              Add New Category
            </span>
          </button>
        </div>

        {/* Tour Categories Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full">
          {/* Header */}
          <div className="flex items-center justify-end gap-2.5 mb-4">
            <div className="flex h-10 flex-col justify-center items-start">
              <h2 className="text-2xl font-medium" style={{ color: "#124645" }}>
                Tour Categories
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex justify-end items-center gap-2 flex-1">
                <div className="flex justify-between items-center flex-1">
                  <div className="flex justify-end items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {/* Search Input */}
                      <div className="flex flex-col items-end gap-2 w-96">
                        <div className="flex justify-end items-center gap-2 flex-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 22L20 20"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 text-gray-400 text-base font-normal outline-none border-none"
                          />
                        </div>
                      </div>
                      {/* Filter Button */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setIsCategoryFilterOpen(!isCategoryFilterOpen)
                          }
                          className="flex items-center w-24 justify-center gap-2 py-2 px-4 rounded border border-gray-200 bg-white shadow-sm"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
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
                          <span className="text-gray-400 text-base font-normal">
                            Filter
                          </span>
                        </button>
                        {isCategoryFilterOpen && (
                          <FilterDropdown
                            isOpen={isCategoryFilterOpen}
                            onClose={() => setIsCategoryFilterOpen(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <TourCategoriesTable
            onEditCategory={(category) => {
              setSelectedCategory(category);
              setShowEditCategoryModal(true);
            }}
          />
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onSave={(categoryData) => {
            console.log("Adding category:", categoryData);
            setShowAddCategoryModal(false);
          }}
        />
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowEditCategoryModal(false);
            setSelectedCategory(null);
          }}
          onSave={(categoryData) => {
            console.log("Updating category:", categoryData);
            setShowEditCategoryModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ToursManagement;
