import React from "react";

const StatsCard = ({ title, value, icon, linkText = "View all" }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-500 rounded-md flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <button className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors">
          {linkText}
        </button>
      </div>
    </div>
  );
};

export default StatsCard;
