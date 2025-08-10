// src/components/admin/AddCommentModal.jsx
import React, { useState, useEffect } from "react";
import { Edit2, ArrowDown2, User, Calendar } from 'iconsax-react';
import enFlag from "../../assets/flags/en.png";
import adminService from "../../services/adminService";

const AddCommentModal = ({ onClose, onSave, editComment = null }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tours, setTours] = useState([]);
  const [initialData, setInitialData] = useState(null); // Add initial data state
  
  const [formData, setFormData] = useState({
    city_id: "",
    category_id: "",
    tour_id: "",
    tour_title: "",
    comment: "",
    client_name: "",
    rating: 5
  });

  // Change detection functions
  const hasChanges = () => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  // Load edit data
  useEffect(() => {
    if (editComment) {
      const initialFormData = {
        city_id: editComment.city_id || "",
        category_id: editComment.category_id || "",
        tour_id: editComment.tour_id || "",
        tour_title: editComment.tour_title || "",
        comment: editComment.comment || "",
        client_name: editComment.client_name || "",
        rating: editComment.rating || 5
      };
      
      setFormData(initialFormData);
      setInitialData(JSON.parse(JSON.stringify(initialFormData))); // Store initial data for change detection
    }
  }, [editComment]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesResponse, categoriesResponse] = await Promise.all([
          adminService.getCities(),
          adminService.getCategories({ active_only: true })
        ]);

        if (citiesResponse.success) {
          setCities(citiesResponse.data.filter(city => city.is_active));
        }
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.filter(cat => cat.is_active));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch tours when city/category changes (only for add mode)
  useEffect(() => {
    if (!editComment && (formData.city_id || formData.category_id)) {
      const fetchTours = async () => {
        try {
          const params = {};
          if (formData.city_id) params.city_id = formData.city_id;
          if (formData.category_id) params.category_id = formData.category_id;
          
          const response = await adminService.getTours(params);
          if (response.success) {
            setTours(response.data.tours || []);
          }
        } catch (error) {
          console.error('Error fetching tours:', error);
        }
      };

      fetchTours();
    } else if (!editComment) {
      setTours([]);
    }
  }, [formData.city_id, formData.category_id, editComment]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tour_id) {
      newErrors.tour_id = "Tour selection is required";
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    }
    if (!formData.client_name.trim()) {
      newErrors.client_name = "Client name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear tour selection if city/category changes (only for add mode)
    if (!editComment && (field === 'city_id' || field === 'category_id')) {
      setFormData(prev => ({ ...prev, tour_id: "", tour_title: "" }));
    }
  };

  const handleTourSelect = (tourId) => {
    if (!editComment) { // Only allow tour selection in add mode
      const selectedTour = tours.find(tour => tour.id === parseInt(tourId));
      setFormData(prev => ({
        ...prev,
        tour_id: tourId,
        tour_title: selectedTour?.title || ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check for changes in edit mode
    if (editComment && !hasChanges()) {
      onClose(); // Close without making request if no changes
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        tour_id: formData.tour_id,
        client_name: formData.client_name,
        rating: formData.rating,
        comment: formData.comment,
        review_date: new Date().toISOString().split('T')[0]
      };

      let response;
      if (editComment) {
        response = await adminService.updateReview(editComment.id, reviewData);
      } else {
        response = await adminService.createReview(reviewData);
      }
      
      if (response.success) {
        onSave(response.data);
      } else {
        setErrors({ submit: response.message || "Failed to save comment" });
      }
    } catch (error) {
      console.error('Save comment error:', error);
      setErrors({ submit: "An error occurred while saving the comment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 m-4 max-h-[90vh] overflow-y-auto">
        {/* Header - NO LANGUAGE SWITCHER for comments */}
        <div className="flex justify-end items-center gap-2 w-full border-b border-gray-300 pb-2">
          <div className="flex pb-2 items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path
                  d="M9.65366 2.66675H7.12033C4.20033 2.66675 2.66699 4.20008 2.66699 7.10675V9.64008C2.66699 12.5467 4.20033 14.0801 7.10699 14.0801H9.64033C12.547 14.0801 14.0803 12.5467 14.0803 9.64008V7.10675C14.0937 4.20008 12.5603 2.66675 9.65366 2.66675Z"
                  fill="#2BA6A4"
                />
                <path
                  d="M9.65366 2.66675H7.12033C4.20033 2.66675 2.66699 4.20008 2.66699 7.10675V9.64008C2.66699 12.5467 4.20033 14.0801 7.10699 14.0801H9.64033C12.547 14.0801 14.0803 12.5467 14.0803 9.64008V7.10675C14.0937 4.20008 12.5603 2.66675 9.65366 2.66675Z"
                  fill="black"
                  fillOpacity="0.2"
                />
                <g opacity="0.4">
                  <path
                    d="M24.8933 2.66675H22.3599C19.4533 2.66675 17.9199 4.20008 17.9199 7.10675V9.64008C17.9199 12.5467 19.4533 14.0801 22.3599 14.0801H24.8933C27.7999 14.0801 29.3333 12.5467 29.3333 9.64008V7.10675C29.3333 4.20008 27.7999 2.66675 24.8933 2.66675Z"
                    fill="#2BA6A4"
                  />
                  <path
                    d="M24.8933 2.66675H22.3599C19.4533 2.66675 17.9199 4.20008 17.9199 7.10675V9.64008C17.9199 12.5467 19.4533 14.0801 22.3599 14.0801H24.8933C27.7999 14.0801 29.3333 12.5467 29.3333 9.64008V7.10675C29.3333 4.20008 27.7999 2.66675 24.8933 2.66675Z"
                    fill="black"
                    fillOpacity="0.2"
                  />
                </g>
                <path
                  d="M24.8933 17.9067H22.3599C19.4533 17.9067 17.9199 19.4401 17.9199 22.3467V24.8801C17.9199 27.7867 19.4533 29.3201 22.3599 29.3201H24.8933C27.7999 29.3201 29.3333 27.7867 29.3333 24.8801V22.3467C29.3333 19.4401 27.7999 17.9067 24.8933 17.9067Z"
                  fill="#2BA6A4"
                />
                <path
                  d="M24.8933 17.9067H22.3599C19.4533 17.9067 17.9199 19.4401 17.9199 22.3467V24.8801C17.9199 27.7867 19.4533 29.3201 22.3599 29.3201H24.8933C27.7999 29.3201 29.3333 27.7867 29.3333 24.8801V22.3467C29.3333 19.4401 27.7999 17.9067 24.8933 17.9067Z"
                  fill="black"
                  fillOpacity="0.2"
                />
                <path
                  opacity="0.4"
                  d="M9.65366 17.9067H7.12033C4.20033 17.9067 2.66699 19.4401 2.66699 22.3467V24.8801C2.66699 27.8001 4.20033 29.3334 7.10699 29.3334H9.64033C12.547 29.3334 14.0803 27.8001 14.0803 24.8934V22.3601C14.0937 19.4401 12.5603 17.9067 9.65366 17.9067Z"
                  fill="#145DA0"
                />
              </svg>
              <h2 className="text-xl font-bold text-right" style={{ color: "#124645" }}>
                {editComment ? "Edit Comment" : "Add New Comment"}
              </h2>
            </div>
          </div>

          {/* <div className="flex h-12 py-3 items-center gap-2">
            <img src={enFlag} alt="English" className="w-6 h-6 rounded-sm" />
            <span className="text-gray-900 text-xl font-medium">English</span>
          </div> */}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 w-full">
          {/* City and Category - READ-ONLY in edit mode */}
          <div className="flex items-start gap-4 w-full">
            <div className="flex flex-col items-start gap-2 flex-1">
              <label className="text-xl font-normal" style={{ color: "#222E50" }}>
                City
              </label>
              <div className="relative w-full">
                <select
                  value={formData.city_id}
                  onChange={(e) => handleInputChange('city_id', e.target.value)}
                  disabled={!!editComment} // Read-only in edit mode
                  className={`w-full h-9 px-4 text-danim-900 border border-gray-200 rounded-md text-base font-normal appearance-none ${
                    editComment ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <ArrowDown2 size="20" color="#8A8D95" className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex flex-col items-start gap-2 flex-1">
              <label className="text-xl font-normal" style={{ color: "#222E50" }}>
                Category
              </label>
              <div className="relative w-full">
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  disabled={!!editComment} // Read-only in edit mode
                  className={`w-full h-9 px-4 text-danim-900 border border-gray-200 rounded-md text-base font-normal appearance-none ${
                    editComment ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ArrowDown2 size="20" color="#8A8D95" className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tour Title - READ-ONLY in edit mode */}
          <div className="flex flex-col items-start gap-2 w-full">
            <label className="text-xl font-normal" style={{ color: "#222E50" }}>
              Tour Title
            </label>
            <div className="relative w-full">
              {editComment ? (
                // Show as read-only text input in edit mode
                <input
                  type="text"
                  value={formData.tour_title}
                  readOnly
                  className="w-full h-9 px-4 text-danim-900 border border-gray-200 rounded-md bg-gray-100 text-base font-normal cursor-not-allowed"
                />
              ) : (
                // Show as dropdown in add mode
                <select
                  value={formData.tour_id}
                  onChange={(e) => handleTourSelect(e.target.value)}
                  className={`w-full h-9 px-4 text-danim-900 border rounded-md bg-white text-base font-normal appearance-none ${
                    errors.tour_id ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                >
                  <option value="">Select Tour</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.title || `Tour #${tour.id}`}
                    </option>
                  ))}
                </select>
              )}
              {!editComment && <ArrowDown2 size="20" color="#8A8D95" className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />}
            </div>
            {errors.tour_id && (
              <span className="text-red-500 text-sm">{errors.tour_id}</span>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col items-start gap-2 w-full">
            <label className="text-xl font-normal" style={{ color: "#222E50" }}>
              Comment
            </label>
            <div className={`flex px-4 py-3 justify-end items-start gap-2 w-full border rounded-md bg-white ${
              errors.comment ? 'border-red-500' : 'border-gray-200'
            }`}>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Enter Comment"
                className="flex-1 text-danim-900 placeholder-rose-black-200 text-base font-normal outline-none border-none resize-none"
                rows="4"
                required
              />
            </div>
            {errors.comment && (
              <span className="text-red-500 text-sm">{errors.comment}</span>
            )}
          </div>

          {/* Client Name */}
          <div className="flex flex-col items-start gap-2 w-full">
            <label className="text-xl font-normal" style={{ color: "#222E50" }}>
              Client Name
            </label>
            <div className={`flex h-9 px-4 py-3 justify-end items-center gap-2 w-full border rounded-md bg-white ${
              errors.client_name ? 'border-red-500' : 'border-gray-200'
            }`}>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                placeholder="Enter client name"
                className="flex-1 text-danim-900 placeholder-rose-black-200 text-base font-normal outline-none border-none"
                required
              />
            </div>
            {errors.client_name && (
              <span className="text-red-500 text-sm">{errors.client_name}</span>
            )}
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="text-red-500 text-sm w-full text-center">
              {errors.submit}
            </div>
          )}

          {/* Changes Warning - Only show in edit mode */}
          {editComment && hasChanges() && (
            <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="text-sm text-yellow-800">
                <strong>Changes detected:</strong> You've modified the comment.
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex px-0 py-4 items-center gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded border border-teal-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#F3F3EE" }}
            >
              <span className="text-xl font-semibold" style={{ color: "#1F7674" }}>
                Cancel
              </span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded bg-teal-700 hover:bg-teal-800 transition-colors disabled:opacity-50"
            >
              <span className="text-xl font-semibold" style={{ color: "#EAF6F6" }}>
                {loading ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommentModal;