import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import ToursTable from "../../components/admin/ToursTable";
import TourCategoriesTable from "../../components/admin/TourCategoriesTable";
import AddCategoryModal from "../../components/admin/AddCategoryModal";
import EditCategoryModal from "../../components/admin/EditCategoryModal";
import FilterDropdown from "../../components/admin/FilterDropdown";
import { CloseCircle, GlobalRefresh, TickCircle, SearchNormal1, Filter, Add } from "iconsax-react";
import adminService from "../../services/adminService";

const ToursManagement = () => {
  const navigate = useNavigate();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Tours",
      value: loading ? "..." : (dashboardStats?.totalTours || "0"),
      icon: <GlobalRefresh size="24" color="#FFFFFF" />,
    },
    {
      title: "Active Tours", 
      value: loading ? "..." : (dashboardStats?.activeTours || "0"),
      icon: <TickCircle size="24" color="#FFFFFF" />,
    },
    {
      title: "Deactivated Tours",
      value: loading ? "..." : ((dashboardStats?.totalTours || 0) - (dashboardStats?.activeTours || 0)).toString(),
      icon: <CloseCircle size="24" color="#FFFFFF" />,
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

        <button
          onClick={() => navigate("/admin/tours/add")}
          className="flex h-10 items-center gap-2 px-3 py-2 rounded bg-teal-700 text-white hover:bg-teal-800 transition-colors"
        >
          <Add size="16" color="#EAF6F6" />
          <span
            className="text-base font-semibold"
            style={{ color: "#EAF6F6" }}
          >
            Add New Tour
          </span>
        </button>

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
                          <SearchNormal1 size="24" color="#B3B3B3" />
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
                          <Filter size="20" color="#9E939A" />
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

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex h-10 items-center gap-2 px-3 py-2 rounded bg-teal-700 text-white hover:bg-teal-800 transition-colors"
          >
            <Add size="16" color="#EAF6F6" />
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
                          <SearchNormal1 size="24" color="#B3B3B3" />
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
                          <Filter size="20" color="#9E939A" />
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