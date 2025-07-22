import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import EditProfileModal from "../../components/admin/EditProfileModal";
import LogoutConfirmModal from "../../components/admin/LogoutConfirmModal";
import { mockAdminUser } from "../../data/adminMockData";

const AdminProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <AdminLayout activeItem="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-teal-800">My Profile</h2>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image and Info */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 w-9 h-9 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <svg
                    className="w-5 h-5 text-teal-800"
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
                </button>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {mockAdminUser.name}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-teal-50 text-teal-800">
                  Supervisor
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 lg:ml-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 text-teal-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
                Edit Profile
              </button>

              <button className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 text-teal-800 rounded-md hover:bg-gray-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Password
              </button>

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
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
                  {mockAdminUser.email}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700 min-w-0 flex-shrink-0">
                  Phone Number
                </span>
                <span className="text-gray-900 font-semibold">01018128987</span>
              </div>
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
