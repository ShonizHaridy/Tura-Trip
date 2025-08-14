// TourCategoriesTable.jsx
import React, { useState, useEffect } from "react";
import { Edit2, Trash } from "iconsax-react";
import DynamicPagination from "./DynamicPagination";
import adminService from "../../services/adminService";

const TourCategoriesTable = ({ onEditCategory, searchTerm = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  // ✅ FIX: Use searchTerm from props and reset page when search changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]); // ✅ FIX: Depend on searchTerm from props

  const fetchCategories = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getCategories({ 
        include_stats: true,
        page: page,
        limit: itemsPerPage,
        search: search // ✅ FIX: Use search parameter
      });
      if (response.success) {
        if (response.data.categories) {
          setCategories(response.data.categories);
          setTotalItems(response.data.pagination?.totalItems || 0);
        } else {
          // Client-side filtering if server doesn't support search
          const filtered = search 
            ? response.data.filter(cat => 
                cat.name.toLowerCase().includes(search.toLowerCase())
              )
            : response.data;
          
          setCategories(filtered);
          setTotalItems(filtered.length);
        }
      } else {
        setError("Failed to load categories");
      }
    } catch (error) {
      console.error("Categories error:", error);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Remove unused internal search state and handlers

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = totalItems <= itemsPerPage ? categories : categories;

  const StatusBadge = ({ status }) => {
    const isActive = status === 1 || status === true || status === "Active";
    return (
      <div
        className={`flex justify-center items-center rounded-full px-2.5 py-0.5 ${
          isActive ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <span
          className={`text-center text-xs font-normal ${
            isActive ? "text-green-800" : "text-gray-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
    );
  };

  const handleEdit = (category) => {
    if (onEditCategory) {
      onEditCategory(category);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await adminService.deleteCategory(categoryId);
        if (response.success) {
          await fetchCategories();
        } else {
          alert(response.message || "Failed to delete category");
        }
      } catch (error) {
        console.error("Delete category error:", error);
        alert("Failed to delete category");
      }
    }
  };

  const ActionButtons = ({ category }) => (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => handleEdit(category)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Edit Category"
      >
        <Edit2 size="20" color="currentColor" />
      </button>
      <button
        onClick={() => handleDelete(category.id)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Category"
      >
        <Trash size="20" color="currentColor" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-start w-full rounded-lg border border-gray-200 bg-white">
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-gray-500">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start w-full rounded-lg border border-gray-200 bg-white">
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full rounded-lg border border-gray-200 bg-white">
      {/* Table Header */}
      <div
        className="grid grid-cols-5 gap-4 w-full h-14 px-4 py-3 items-center border-b border-gray-200"
        style={{ 
          backgroundColor: "#ECEFF7",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr"
        }}
      >
        <div className="text-left">
          <span className="text-gray-900 text-base font-normal">
            Category Name
          </span>
        </div>
        <div className="text-center">
          <span className="text-gray-900 text-base font-normal">Cities</span>
        </div>
        <div className="text-center">
          <span className="text-gray-900 text-base font-normal">
            Number of Tours
          </span>
        </div>
        <div className="text-center">
          <span className="text-gray-900 text-base font-normal">Status</span>
        </div>
        <div className="text-center">
          <span className="text-gray-900 text-base font-normal">Actions</span>
        </div>
      </div>

      {/* Table Rows */}
      {currentCategories.map((category, index) => (
        <React.Fragment key={`row-${category.id}`}>
          <div
            className="grid grid-cols-5 gap-4 w-full px-4 py-4 items-center"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}
          >
            {/* Category Name */}
            <div className="text-left">
              <span className="text-gray-600 text-base font-normal">
                {category.name}
              </span>
            </div>

            {/* Cities */}
            <div className="text-center">
              <span className="text-gray-600 text-base font-normal">
                {category.cities || "All Cities"}
              </span>
            </div>

            {/* Number of Tours */}
            <div className="text-center">
              <span className="text-gray-600 text-base font-normal">
                {category.active_tours_count || category.total_tours_count || 0}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-center">
              <StatusBadge status={category.is_active} />
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <ActionButtons category={category} />
            </div>
          </div>
          {index < currentCategories.length - 1 && (
            <div className="h-px w-full bg-gray-200"></div>
          )}
        </React.Fragment>
      ))}

      {/* ✅ FIX: Show "No results" message when search yields no results */}
      {currentCategories.length === 0 && searchTerm && (
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-gray-500">No categories found for "{searchTerm}"</span>
        </div>
      )}

      {/* Pagination */}
      <DynamicPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default TourCategoriesTable;