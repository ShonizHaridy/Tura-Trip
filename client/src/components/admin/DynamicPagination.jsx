// Create a reusable Pagination component
// components/admin/DynamicPagination.jsx
import React from 'react';

const DynamicPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null; // Don't show pagination for single page

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      <div className="h-px w-full bg-gray-200"></div>
      <div className="flex justify-between items-center px-4 py-3 w-full">
        <div className="text-gray-900 text-base font-normal">
          Showing {startIndex} to {endIndex} of {totalItems}
        </div>
        <div className="flex justify-end items-center">
          <div className="flex items-center">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
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
                  onClick={() => onPageChange(pageNum)}
                  className={`flex justify-center items-center px-4 py-2.5 border ${
                    isCurrentPage
                      ? "border-teal-700 bg-teal-100"
                      : "border-gray-300 bg-white hover:bg-gray-50"
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

            {/* Next Button */}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
};

export default DynamicPagination;