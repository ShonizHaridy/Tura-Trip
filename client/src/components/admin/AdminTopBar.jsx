// src/components/admin/AdminTopBar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { mockAdminUser } from "../../data/adminMockData";
import { useAuth } from "../../contexts/AuthContext";
import logoHorizontal from "../../assets/logo_horizontal.svg";
import notificationService from "../../services/notificationService";

const AdminTopBar = () => {
  const navigate = useNavigate();
  const { admin } = useAuth()
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications({
        limit: 10,
        unread_only: false
      });
      if (response.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async () => {
    if (!showNotifications) {
      await fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  // ✅ NEW: Handle individual notification click to navigate and search
  const handleIndividualNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markAsRead([notification.id]);
    }

    // Navigate based on notification type
    if (notification.type === 'review' && notification.related_type === 'tour') {
      // Navigate to comments tab with search for the tour
      navigate(`/admin/content?tab=comments&search=${encodeURIComponent(notification.tour_title || '')}`);
    } else {
      // Default navigation to content page
      navigate('/admin/content?tab=comments');
    }

    setShowNotifications(false);
  };

  const markAsRead = async (notificationIds) => {
    try {
      await notificationService.markAsRead(notificationIds);
      await fetchUnreadCount();
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  return (
    <div className="bg-[#F9F9F7] border-b border-gray-200 h-[68px] flex items-center justify-between px-4 shadow-sm fixed top-0 left-0 right-0 z-40">
      {/* Logo Section */}
      <div className="w-60 px-4">
        <div className="flex items-center justify-center">
          <img
            src={logoHorizontal}
            alt="Logo horizontal"
            className="h-[28.93px]"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 px-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={handleNotificationClick}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#233660]"
              >
                <path
                  d="M12.0196 2.91016C8.7096 2.91016 6.0196 5.60016 6.0196 8.91016V11.8002C6.0196 12.4102 5.7596 13.3402 5.4496 13.8602L4.2996 15.7702C3.5896 16.9502 4.0796 18.2602 5.3796 18.7002C9.6896 20.1402 14.3396 20.1402 18.6496 18.7002C19.8596 18.3002 20.3896 16.8702 19.7296 15.7702L18.5796 13.8602C18.2796 13.3402 18.0196 12.4102 18.0196 11.8002V8.91016C18.0196 5.61016 15.3196 2.91016 12.0196 2.91016Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.0195 19.0601C15.0195 20.7101 13.6695 22.0601 12.0195 22.0601C11.1995 22.0601 10.4395 21.7201 9.89953 21.1801C9.35953 20.6401 9.01953 19.8801 9.01953 19.0601"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
              </svg>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#E81E1E] text-[#FEFEFD] text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
          </button>

          {/* ✅ ENHANCED Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAsRead(notifications.filter(n => !n.is_read).map(n => n.id))}
                      className="text-sm text-teal-600 hover:text-teal-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleIndividualNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.is_read ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {notification.message}
                          </p>
                          {/* ✅ Show tour context if available */}
                          {notification.tour_title && (
                            <p className="text-xs text-blue-600 mt-1">
                              Tour: {notification.tour_title} ({notification.city_name})
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5v-5h5v5z"></path>
                    </svg>
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white font-semibold">
              {/* ✅ Use admin from context instead of mockAdminUser */}
              {admin?.name 
                ? admin.name.split(" ").map((n) => n[0]).join("")
                : "AD"}
            </div>
            <div className="text-left">
              <div className="text-sm font-normal text-[#0B101A] font-roboto">
                {/* ✅ Use admin from context instead of mockAdminUser */}
                {admin?.name || "Admin"}
              </div>
            </div>
          </button>
      </div>
    </div>
  );
};

export default AdminTopBar;