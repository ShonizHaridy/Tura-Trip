import React, { useState, useEffect, useRef } from "react";
import { mockAdminTours } from "../../data/adminMockData";
import { useNavigate } from "react-router-dom";

const ToursTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalItems = mockAdminTours.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const navigate = useNavigate();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTours = mockAdminTours.slice(startIndex, endIndex);

  const StatusBadge = ({ status }) => {
    const isActive = status === "Active";
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
          {status}
        </span>
      </div>
    );
  };

  const ActionButtons = ({ tourId }) => (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(`/admin/tours/edit/${tourId}`)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Edit Tour"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.2603 3.60022L5.05034 12.2902C4.74034 12.6202 4.44034 13.2702 4.38034 13.7202L4.01034 16.9602C3.88034 18.1302 4.72034 18.9302 5.88034 18.7302L9.10034 18.1802C9.55034 18.1002 10.1803 17.7702 10.4903 17.4302L18.7003 8.74022C20.1203 7.24022 20.7603 5.53022 18.5503 3.44022C16.3503 1.37022 14.6803 2.10022 13.2603 3.60022Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.8896 5.0498C12.3196 7.8098 14.5596 9.9198 17.3396 10.1998"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 22H21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this tour?")) {
            console.log("Delete tour:", tourId);
          }
        }}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Tour"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.8504 9.14014L18.2004 19.2101C18.0904 20.7801 18.0004 22.0001 15.2104 22.0001H8.79039C6.00039 22.0001 5.91039 20.7801 5.80039 19.2101L5.15039 9.14014"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.3301 16.5H13.6601"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 12.5H14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );

  const Pagination = () => (
    <div className="flex flex-col items-start gap-6 w-full">
      <div className="h-px w-full" style={{ backgroundColor: "#ECEFF7" }}></div>
      <div className="flex justify-between items-center px-4 py-3 w-full">
        <div className="text-gray-900 text-base font-normal">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
          {totalItems}
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
      {currentTours.map((tour, index) => (
        <React.Fragment key={`row-${tour.id}`}>
          <div className="flex w-full px-4 py-4 items-center">
            {/* Tour Title with Image */}
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div
                className="flex w-24 p-2.5 justify-center items-center gap-2.5 rounded flex-shrink-0"
                style={{ backgroundColor: "#ECEFF7" }}
              >
                <svg
                  className="w-6 h-6 text-gray-900"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    d="M22.1799 17.2936L19.0499 9.98362C17.9899 7.50362 16.0399 7.40362 14.7299 9.76362L12.8399 13.1736C11.8799 14.9036 10.0899 15.0536 8.84993 13.5036L8.62993 13.2236C7.33993 11.6036 5.51993 11.8036 4.58993 13.6536L2.86993 17.1036C1.65993 19.5036 3.40993 22.3336 6.08993 22.3336H18.8499C21.4499 22.3336 23.1999 19.6836 22.1799 17.2936Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.47021 8.3335C9.12707 8.3335 10.4702 6.99035 10.4702 5.3335C10.4702 3.67664 9.12707 2.3335 7.47021 2.3335C5.81336 2.3335 4.47021 3.67664 4.47021 5.3335C4.47021 6.99035 5.81336 8.3335 7.47021 8.3335Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-gray-600 text-base font-normal truncate">
                  {tour.title}
                </span>
              </div>
            </div>

            {/* City */}
            <div className="w-32 text-center">
              <span className="text-gray-600 text-base font-normal">
                {tour.city}
              </span>
            </div>

            {/* Type */}
            <div className="w-28 text-center">
              <span className="text-gray-600 text-base font-normal">
                {tour.type}
              </span>
            </div>

            {/* Price/Adult */}
            <div className="w-32 text-center">
              <span className="text-gray-600 text-base font-normal">
                ${tour.priceAdult}
              </span>
            </div>

            {/* Price/Child */}
            <div className="w-32 text-center">
              <span className="text-gray-600 text-base font-normal">
                ${tour.priceChild}
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
          {index < currentTours.length - 1 && (
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
