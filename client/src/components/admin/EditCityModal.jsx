// src/components/admin/EditCityModal.jsx
import React, { useState } from "react";

const EditCityModal = ({ city, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: city?.name || "",
    status: city?.status || "Active",
    categories: city?.categories || ["historical", "spa", "sea", "safari"],
    description: city?.description || "",
    image: city?.image || null,
  });

  const tourCategories = [
    { id: "historical", name: "Historical Cities" },
    { id: "sea", name: "Sea Excursions" },
    { id: "safari", name: "Safari And Adventure" },
    { id: "spa", name: "Entertainment And SPA" },
    { id: "transfer", name: "Transfer" },
    { id: "individual", name: "Individual Tours" },
  ];

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleFileUpload = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...city, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Edit City</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              <span className="text-lg font-medium text-gray-800">English</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* City Name */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">City Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* City Status */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">City Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Tour Categories */}
          <div className="space-y-3">
            <label className="text-lg font-medium text-gray-700">Tour Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {tourCategories.map((category) => (
                <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700 text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">Description & Highlights</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* City Image */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">City Image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload(file);
                };
                input.click();
              }}
            >
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">Upload or drag a file here</p>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm"
              >
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-1">
                The file size must not exceed 10 MB and be in PDF format.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCityModal;