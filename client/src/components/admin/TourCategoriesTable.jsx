import React, { useState } from "react";
import { mockTourCategories } from "../../data/adminMockData";

const TourCategoriesTable = ({ onEditCategory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalItems = mockTourCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = mockTourCategories.slice(startIndex, endIndex);

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

  const handleEdit = (category) => {
    if (onEditCategory) {
      onEditCategory(category);
    }
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log("Delete category:", categoryId);
    }
  };

  const ActionButtons = ({ category }) => (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleEdit(category)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Edit Category"
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
        onClick={() => handleDelete(category.id)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Category"
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
      {/* Table */}
      <div className="flex h-full items-center w-full">
        {/* Category Name Column */}
        <div className="flex flex-col items-end w-64 h-full">
          <div
            className="flex h-14 px-4 py-3 items-center w-full"
            style={{ backgroundColor: "#ECEFF7" }}
          >
            <span className="text-gray-900 text-base font-normal">
              Category Name
            </span>
          </div>
          <div className="h-px w-full bg-gray-200"></div>

          {currentCategories.map((category, index) => (
            <React.Fragment key={`name-${category.id}`}>
              <div className="flex px-4 py-4 items-center flex-1 w-full">
                <span className="text-gray-600 text-base font-normal">
                  {category.name}
                </span>
              </div>
              {index < currentCategories.length - 1 && (
                <div className="h-px w-full bg-gray-200"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Cities Column */}
        <div className="flex flex-col items-end w-96 h-full">
          <div
            className="flex h-14 px-4 py-3 items-center w-full"
            style={{ backgroundColor: "#ECEFF7" }}
          >
            <span className="text-gray-900 text-base font-normal">cities</span>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
          {currentCategories.map((category, index) => (
            <React.Fragment key={`cities-${category.id}`}>
              <div className="flex px-4 py-4 items-center flex-1 w-full">
                <span className="text-gray-600 text-base font-normal">
                  {category.cities}
                </span>
              </div>
              {index < currentCategories.length - 1 && (
                <div className="h-px w-full bg-gray-200"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Number of Tours Column */}
        <div className="flex flex-col items-start w-full">
          <div
            className="flex h-14 px-4 py-3 items-center w-full"
            style={{ backgroundColor: "#ECEFF7" }}
          >
            <span className="text-gray-900 text-base font-normal">
              Number of tours
            </span>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
          {currentCategories.map((category, index) => (
            <React.Fragment key={`tours-${category.id}`}>
              <div className="flex px-4 py-4 items-center flex-1 w-full">
                <span className="text-gray-600 text-base font-normal">
                  {category.numberOfTours}
                </span>
              </div>
              {index < currentCategories.length - 1 && (
                <div className="h-px w-full bg-gray-200"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Status Column */}
        <div className="flex flex-col items-end w-32 h-full">
          <div
            className="flex h-14 px-4 py-3 items-center w-full"
            style={{ backgroundColor: "#ECEFF7" }}
          >
            <span className="text-gray-900 text-base font-normal">Status</span>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
          {currentCategories.map((category, index) => (
            <React.Fragment key={`status-${category.id}`}>
              <div className="flex px-4 py-4 items-center flex-1 w-full">
                <StatusBadge status={category.status} />
              </div>
              {index < currentCategories.length - 1 && (
                <div className="h-px w-full bg-gray-200"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Actions Column */}
        <div className="flex flex-col items-end flex-1 h-full">
          <div className="h-px w-full bg-gray-200"></div>
          <div
            className="flex h-14 px-4 py-3 items-center w-full"
            style={{ backgroundColor: "#ECEFF7" }}
          >
            <span className="text-gray-900 text-base font-normal"> </span>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
          {currentCategories.map((category, index) => (
            <React.Fragment key={`actions-${category.id}`}>
              <div className="flex px-4 py-4 items-center gap-4 flex-1 w-full">
                <ActionButtons category={category} />
              </div>
              {index < currentCategories.length - 1 && (
                <div className="h-px w-full bg-gray-200"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default TourCategoriesTable;
