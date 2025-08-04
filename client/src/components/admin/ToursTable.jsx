import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash, Image } from "iconsax-react";
import adminService from "../../services/adminService";

const ToursTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, [currentPage]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getTours({
        page: currentPage,
        limit: itemsPerPage
      });
      if (response.success) {
        setTours(response.data.tours);
        setTotalItems(response.data.pagination.totalItems);
      } else {
        setError("Failed to load tours");
      }
    } catch (error) {
      console.error("Tours error:", error);
      setError("Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const StatusBadge = ({ status }) => {
    const isActive = status === "active";
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

  const ActionButtons = ({ tourId }) => (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(`/admin/tours/edit/${tourId}`)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Edit Tour"
      >
        <Edit2 size="24" color="currentColor" />
      </button>
      <button
        onClick={() => handleDelete(tourId)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Tour"
      >
        <Trash size="24" color="currentColor" />
      </button>
    </div>
  );

  const Pagination = () => (
    <div className="flex flex-col items-start gap-6 w-full">
      <div className="h-px w-full" style={{ backgroundColor: "#ECEFF7" }}></div>
      <div className="flex justify-between items-center px-4 py-3 w-full">
        <div className="text-gray-900 text-base font-normal">
          Showing {startIndex + 1} to {endIndex} of {totalItems}
        </div>
        <div className="flex justify-end items-center">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex justify-center items-center p-2.5 rounded-l border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {[1, 2, 3, "...", 8, 9, 10].map((pageNum, index) => {
              if (pageNum === "...") {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex justify-center items-center px-4 py-2.5 border border-gray-300 bg-white"
                  >
                    <span className="text-gray-400 text-base font-normal">
                      ...
                    </span>
                  </div>
                );
              }

              const isCurrentPage = pageNum === currentPage;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex justify-center items-center px-4 py-2.5 border ${
                    isCurrentPage
                      ? "border-teal-700 bg-teal-100"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <span
                    className={`text-base font-normal ${
                      isCurrentPage ? "text-teal-800" : "text-gray-400"
                    }`}
                  >
                    {pageNum}
                  </span>
                  </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex justify-center items-center p-2.5 rounded-r border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-start w-full rounded-lg border border-gray-200 bg-white">
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-gray-500">Loading tours...</span>
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
              <StatusBadge status={tour.status} />
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

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default ToursTable;