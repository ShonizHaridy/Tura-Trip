// src/pages/admin/AdminProfile.jsx
import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import EditProfileModal from "../../components/admin/EditProfileModal";
import LogoutConfirmModal from "../../components/admin/LogoutConfirmModal";
import { useAuth } from "../../contexts/AuthContext";
import { Edit2, Refresh, Logout, User, ProfileCircle } from 'iconsax-react';

const AdminProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { admin } = useAuth(); // Get admin data from context

  return (
    <AdminLayout activeItem="Profile">
      <div className="">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
              <User size="20" color="#ffffff" />
            </div>
            <h2 className="text-xl font-semibold text-teal-800">My Profile</h2>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image and Info */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <div className="relative">
                {/* <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover"
                /> */}
                <ProfileCircle className="w-40 h-40 rounded-full object-cover" color="#010828" />
                {/* <button className="absolute bottom-0 right-0 w-9 h-9 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <Edit2 size="20" color="#155e75" />
                </button> */}
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {admin?.name || 'Admin User'}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-teal-50 text-teal-800">
                  {admin?.role || 'Administrator'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 lg:ml-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 text-teal-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <Edit2 size="20" color="#155e75" />
                Edit Profile
              </button>

              {/* <button className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 text-teal-800 rounded-md hover:bg-gray-300 transition-colors">
                <Refresh size="20" color="#155e75" />
                Reset Password
              </button> */}

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                <Logout size="16" color="#dc2626" />
                Log Out
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700 min-w-0 flex-shrink-0">
                  Email
                </span>
                <span className="text-gray-900 font-semibold">
                  {admin?.email || 'admin@example.com'}
                </span>
              </div>
              {/* <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700 min-w-0 flex-shrink-0">
                  Phone Number
                </span>
                <span className="text-gray-900 font-semibold">01018128987</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </AdminLayout>
  );
};

export default AdminProfile;