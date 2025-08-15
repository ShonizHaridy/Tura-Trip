// ToursTable.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash, Image } from "iconsax-react";
import DynamicPagination from './DynamicPagination';
import adminService from "../../services/adminService";

const ToursTable = ({ searchTerm = "", appliedFilters = {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();


  // ✅ FIXED: Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters]);

  // ✅ FIXED: Single useEffect for data fetching
  useEffect(() => {
    fetchTours();
  }, [currentPage, searchTerm, appliedFilters]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError("");
      
      // ✅ FIXED: Build filters object properly
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...appliedFilters
      };

      console.log('🎯 Fetching tours with params:', params);

      const response = await adminService.getTours(params);
      
      if (response.success) {
        setTours(response.data.tours || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setError("Failed to load tours");
        setTours([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Tours error:", error);
      setError("Failed to load tours");
      setTours([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleTourStatus = async (tourId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await adminService.updateTourStatus(tourId, newStatus);
      
      if (response.success) {
        fetchTours(); // Refresh the list
      } else {
        alert(response.message || "Failed to update tour status");
      }
    } catch (error) {
      console.error('Toggle tour status error:', error);
      alert("Failed to update tour status");
    }
  };

  const StatusBadge = ({ status, tourId, onClick }) => {
    const isActive = status === "active";
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(tourId, status);
        }}
        className={`flex justify-center items-center rounded-full px-2.5 py-0.5 cursor-pointer transition-colors hover:opacity-80 ${
          isActive ? "bg-green-100 hover:bg-green-200" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <span
          className={`text-center text-xs font-normal ${
            isActive ? "text-green-800" : "text-gray-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </button>
    );
  };


  const handleDelete = async (tourId) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        const response = await adminService.deleteTour(tourId);
        if (response.success) {
          await fetchTours(); // Refresh the list
        } else {
          alert(response.message || "Failed to delete tour");
        }
      } catch (error) {
        console.error("Delete tour error:", error);
        alert("Failed to delete tour");
      }
    }
  };

  const handleViewTour = (tourId) => {
    navigate(`/admin/tours/view/${tourId}`);
  };

  const ActionButtons = ({ tourId }) => (
  <div className="flex items-center gap-4">
      <button
        onClick={() => handleViewTour(tourId)}
        className="text-gray-400 hover:text-blue-600 transition-colors"
        title="View Tour"
      >
        <Eye size="20" color="currentColor" />
      </button>
      <button
        onClick={() => navigate(`/admin/tours/edit/${tourId}`)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Edit Tour"
      >
        <Edit2 size="20" color="currentColor" />
      </button>
      <button
        onClick={() => handleDelete(tourId)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Tour"
      >
        <Trash size="20" color="currentColor" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-start w-full rounded-lg border border-gray-200 bg-white">
        <div className="flex justify-center items-center w-full py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
            <span className="text-gray-500">Loading tours...</span>
          </div>
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
        className="flex w-full h-14 px-4 py-3 items-center border-b border-gray-200"
        style={{ backgroundColor: "#ECEFF7" }}
      >
        <div className="flex-1 min-w-0">
          <span className="text-gray-900 text-base font-normal">
            Tour Title
          </span>
        </div>
        <div className="w-32 text-center">
          <span className="text-gray-900 text-base font-normal">City</span>
        </div>
        <div className="w-28 text-center">
          <span className="text-gray-900 text-base font-normal">Type</span>
        </div>
        <div className="w-32 text-center">
          <span className="text-gray-900 text-base font-normal">
            Price/Adult
          </span>
        </div>
        <div className="w-32 text-center">
          <span className="text-gray-900 text-base font-normal">
            Price/Child
          </span>
        </div>
        <div className="w-24 text-center">
          <span className="text-gray-900 text-base font-normal">Status</span>
        </div>
        <div className="w-24 text-center">
          <span className="text-gray-900 text-base font-normal">Actions</span>
        </div>
      </div>

      {/* Table Rows */}
      {tours.map((tour, index) => (
        <React.Fragment key={`row-${tour.id}`}>
          <div className="flex w-full px-4 py-4 items-center">
            {/* Tour Title with Image */}
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div
                className="flex w-24 h-22 justify-center items-center gap-2.5 rounded flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: "#ECEFF7" }}
              >
                {tour.cover_image_url ? (
                  <img 
                    src={tour.cover_image_url} 
                    alt="Tour"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div style={{display: tour.cover_image_url ? 'none' : 'block'}}>
                  <Image size="24" color="#0B101A" />
                </div>
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-gray-600 text-base font-normal truncate">
                  {tour.title || `Tour #${tour.id}`}
                </span>
              </div>
            </div>

            {/* City */}
            <div className="w-32 text-center">
              <span className="text-gray-600 text-base font-normal">
                {tour.city_name || 'N/A'}
              </span>
            </div>

            {/* Type */}
            <div className="w-28 text-center">
              <span className="text-gray-600 text-base font-normal">
                {tour.category_name || tour.category_type || 'N/A'}
              </span>
            </div>

            {/* Price/Adult */}
            <div className="w-32 text-center">
              <span className="text-gray-600 text-base font-normal">
                ${tour.price_adult}
              </span>
            </div>

            {/* Price/Child */}
            <div className="w-32 text-center">
              <span className="text-gray-600 text-base font-normal">
                ${tour.price_child}
              </span>
            </div>

            {/* Status */}
            <div className="w-24 flex justify-center">
              <StatusBadge 
                status={tour.status} 
                tourId={tour.id}
                onClick={toggleTourStatus}
              />
            </div>

            {/* Actions */}
            <div className="w-24 flex justify-center">
              <ActionButtons tourId={tour.id} />
            </div>
          </div>
          {index < tours.length - 1 && (
            <div className="h-px w-full bg-gray-200"></div>
          )}
        </React.Fragment>
      ))}

      {/* ✅ FIXED: Show "No results" message */}
      {tours.length === 0 && (
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-gray-500">
            {searchTerm || Object.keys(appliedFilters).length > 0
              ? `No tours found${searchTerm ? ` for "${searchTerm}"` : ''}`
              : "No tours available"}
          </span>
        </div>
      )}

      {/* Pagination */}
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
  );
};

export default ToursTable;