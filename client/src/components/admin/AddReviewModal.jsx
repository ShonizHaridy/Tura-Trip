// src/components/admin/AddReviewModal.jsx
import React, { useState } from "react";

const AddReviewModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    screenshot: null,
    review: "",
    clientName: "",
    date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      screenshot: formData.screenshot ? URL.createObjectURL(formData.screenshot) : "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100",
      date: formData.date || new Date().toLocaleDateString('en-GB'),
    });
  };

  const handleFileUpload = (file) => {
    setFormData(prev => ({ ...prev, screenshot: file }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Add New Review</h2>
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
          {/* Screenshot Upload */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">Screenshot</label>
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
              {formData.screenshot ? (
                <div className="text-center">
                  <svg className="w-8 h-8 text-teal-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                  <p className="text-sm text-gray-600">{formData.screenshot.name}</p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">Review</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Enter Review"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Client Name and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">Client Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Enter client name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;