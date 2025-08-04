// src/components/admin/LogoutConfirmModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { CloseCircle, Logout } from 'iconsax-react';
import { useAuth } from '../../contexts/AuthContext';

const LogoutConfirmModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Call logout from context
    logout();
    
    // Close modal
    onClose();
    
    // Redirect to login page
    navigate('/admin/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <CloseCircle size="24" color="#dc2626" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Are you sure you want to log out?
          </h3>
          <p className="text-gray-500 text-sm">
            You will be logged out of the system and will need to sign in again
            to access the dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-teal-800 rounded-md hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Logout size="16" color="#ffffff" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;