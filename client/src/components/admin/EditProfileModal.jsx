// src/components/admin/EditProfileModal.jsx - Enhanced with loading states
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import adminService from "../../services/adminService";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { admin, updateAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update form data when admin changes or modal opens
  useEffect(() => {
    if (admin && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: admin.name || "",
        email: admin.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setError("");
      setSuccess("");
    }
  }, [admin, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to change password");
        return false;
      }
      if (formData.newPassword.length < 8) {
        setError("New password must be at least 8 characters long");
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await adminService.updateProfile(updateData);
      
      if (response.success) {
        const updatedAdmin = {
          ...admin,
          name: response.data.name || updateData.name,
          email: response.data.email || updateData.email,
        };
        
        updateAdmin(updatedAdmin);
        setSuccess("Profile updated successfully!");
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        
        // Close modal after delay
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 1500);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while saving
    
    setError("");
    setSuccess("");
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* ✅ Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-teal-600 border-t-transparent"></div>
              <p className="text-teal-600 font-medium">Updating profile...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-teal-800">Edit Profile</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className={`ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md ${
              loading 
                ? 'cursor-not-allowed opacity-50' 
                : 'cursor-pointer hover:bg-gray-100'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 transition-all ${
                    loading 
                      ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                      : 'bg-white cursor-text hover:border-gray-400'
                  }`}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 transition-all ${
                    loading 
                      ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                      : 'bg-white cursor-text hover:border-gray-400'
                  }`}
                  required
                  disabled={loading}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Change Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password (Optional)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    className={`w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                      loading 
                        ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                        : 'bg-white cursor-text hover:border-gray-400'
                    }`}
                    disabled={loading}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className={`w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                        loading 
                          ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                          : 'bg-white cursor-text hover:border-gray-400'
                      }`}
                      minLength="8"
                      disabled={loading}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                        loading 
                          ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                          : 'bg-white cursor-text hover:border-gray-400'
                      }`}
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              {formData.newPassword && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Password must be at least 8 characters long
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 px-6 py-3 border border-teal-600 text-teal-600 rounded-md font-semibold transition-all duration-200 ${
                loading 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:bg-teal-50 hover:border-teal-700 hover:text-teal-700 active:transform active:scale-95'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-teal-600 text-white rounded-md font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                loading 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:bg-teal-700 hover:shadow-md active:transform active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;