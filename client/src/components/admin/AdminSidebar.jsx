import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoHorizontal from "../../assets/logo_horizontal.svg";
import { Building3, PathTool2, Size, StatusUp, MoneyRecive } from "iconsax-react";

const AdminSidebar = ({ activeItem = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isContentExpanded, setIsContentExpanded] = useState(
    location.pathname.startsWith("/admin/content")
  );

  const isActive = (path) => {
    if (path === "/admin/tours") {
      return location.pathname.startsWith("/admin/tours");
    }
    return location.pathname === path;
  };

  const isToursActive = location.pathname.startsWith("/admin/tours");
  const isContentActive = location.pathname.startsWith("/admin/content");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <StatusUp size="24" color="currentColor" />,
    },
    {
      id: "tours",
      label: "Tours",
      path: "/admin/tours",
      hasSubmenu: false,
      icon: <Size size="24" color="currentColor" />,
    },
    {
      id: "cities",
      label: "Cities",
      path: "/admin/cities",
      icon: <Building3 size="24" color="currentColor" />,
    },
    {
      id: "content",
      label: "Content",
      path: "/admin/content",
      hasSubmenu: true,
      icon: <PathTool2 size="24" color="currentColor" />,
      subItems: [
        {
          id: "faqs",
          label: "FAQs",
          path: "/admin/content?tab=faqs",
        },
        {
          id: "reviews",
          label: "Reviews",
          path: "/admin/content?tab=reviews",
        },
        {
          id: "comments",
          label: "Trips Comments",
          path: "/admin/content?tab=comments",
        },
      ],
    },
    {
      id: "commission",
      label: "Commission",
      path: "/admin/commission",
      icon: <MoneyRecive size="24" color="currentColor" />,
    },
  ];

  const handleNavigation = (item) => {
    if (item.hasSubmenu) {
      setIsContentExpanded(!isContentExpanded);
      // Navigate to content page with default tab (FAQs)
      navigate("/admin/content");
    } else {
      navigate(item.path);
    }
  };

  const handleSubNavigation = (subItem) => {
    navigate(subItem.path);
  };

  const isSubItemActive = (subItem) => {
    if (subItem.id === "faqs") {
      return location.pathname === "/admin/content" && 
            (!location.search || location.search.includes("tab=faqs"));
    }
    if (subItem.id === "reviews") {
      return location.pathname === "/admin/content" && 
            location.search.includes("tab=reviews");
    }
    if (subItem.id === "comments") {
      return location.pathname === "/admin/content" && 
            location.search.includes("tab=comments");
    }
    return false;
  };

  return (
    <div
      className="bg-[#F9F9F7] fixed flex flex-col w-60 h-screen border-r border-gray-200"
      style={{ paddingTop: "68px" }}
    >
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id} className="space-y-1">
            {/* Main Menu Item */}
            <button
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                isActive(item.path) || 
                (isToursActive && item.id === "tours") ||
                (isContentActive && item.id === "content")
                  ? "bg-[#2D467C] text-white"
                  : "text-[#2D467C] hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${
                    isActive(item.path) ||
                    (isToursActive && item.id === "tours") ||
                    (isContentActive && item.id === "content")
                      ? "text-white"
                      : "text-[#6581BE]"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-roboto text-base font-semibold">
                  {item.label}
                </span>
              </div>
              {item.hasSubmenu && (
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isContentExpanded ? "rotate-180" : ""
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6004 7.4585L11.1671 12.8918C10.5254 13.5335 9.47539 13.5335 8.83372 12.8918L3.40039 7.4585"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {/* Sub Menu Items */}
            {item.hasSubmenu && isContentExpanded && (
              <div className="ml-6 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleSubNavigation(subItem)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                      isSubItemActive(subItem)
                        ? "bg-[#6581BE] text-white"
                        : "text-[#2D467C] hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></div>
                    <span className="font-roboto font-medium">
                      {subItem.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;