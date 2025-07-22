import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoHorizontal from "../../assets/logo_horizontal.svg";

const AdminSidebar = ({ activeItem = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const isActive = (path) => {
    if (path === "/admin/tours") {
      return location.pathname.startsWith("/admin/tours");
    }
    return location.pathname === path;
  };

  const isToursActive = location.pathname.startsWith("/admin/tours");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.87988 18.1501V16.0801"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 18.1498V14.0098"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17.1201 18.1502V11.9302"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17.1199 5.8501L16.6599 6.3901C14.1099 9.3701 10.6899 11.4801 6.87988 12.4301"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14.1904 5.8501H17.1204V8.7701"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "tours",
      label: "Tours",
      path: "/admin/tours",
      hasSubmenu: false,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.9697 12.25V16.75C16.9697 20.5 15.4697 22 11.7197 22H7.21973C3.46973 22 1.96973 20.5 1.96973 16.75V12.25C1.96973 8.5 3.46973 7 7.21973 7H11.7197C15.4697 7 16.9697 8.5 16.9697 12.25Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.9697 5.85V9.15C21.9697 11.9 20.8697 13 18.1197 13H16.9697V12.25C16.9697 8.5 15.4697 7 11.7197 7H10.9697V5.85C10.9697 3.1 12.0697 2 14.8197 2H18.1197C20.8697 2 21.9697 3.1 21.9697 5.85Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "cities",
      label: "Cities",
      path: "/admin/cities",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 22H22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.01 21.9898L3.01001 22.0099L3 7.06986C3 6.39986 3.34001 5.77983 3.89001 5.40983L7.89001 2.73984C8.56001 2.28984 9.43999 2.28984 10.11 2.73984L14.11 5.40983C14.67 5.77983 15 6.39986 15 7.06986L15.01 21.9898Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.9805 22.01V18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12C18.9 12 18 12.9 18 14V16C18 17.1 18.9 18 20 18C21.1 18 22 17.1 22 16V14C22 12.9 21.1 12 20 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 14H15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V18.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "content",
      label: "Content",
      path: "/admin/content",
      hasSubmenu: true,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_6228_5609)">
            <path
              d="M9.87007 22.0001H14.1601C15.7801 22.0001 16.8501 20.8401 16.5301 19.4301L15.8401 16.3501H8.20007L7.51007 19.4301C7.20007 20.7601 8.34007 22.0001 9.87007 22.0001Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.8301 16.3501L18.7701 13.7401C20.4101 12.2801 20.4801 11.2601 19.1801 9.61012L13.9901 3.03012C12.9001 1.65012 11.1201 1.65012 10.0201 3.03012L4.84013 9.61012C3.54013 11.2601 3.54013 12.3301 5.25013 13.7401L8.19013 16.3501"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.0098 2.66992V6.96992"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_6228_5609">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
      {
    id: "commission",
    label: "Commission Settings",
    path: "/admin/commission",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
        <path d="M10 4.5C9.17 4.5 8.5 5.17 8.5 6H7C7 4.34 8.34 3 10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9H9.5V10.5H10.5V12H9.5V13.5H8V12H7V10.5H8V9H7V7.5H8C8 5.84 8.84 4.5 10 4.5Z" fill="white"/>
      </svg>
      ),
    },
  ];

  return (
    <div
      className="bg-[#F9F9F7] flex flex-col w-60 h-screen border-r border-gray-200"
      style={{ paddingTop: "68px" }}
    >
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  setIsContentExpanded(!isContentExpanded);
                }
                navigate(item.path);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                isActive(item.path) || (isToursActive && item.id === "tours")
                  ? "bg-[#2D467C] text-white"
                  : "text-[#2D467C] hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${
                    isActive(item.path) ||
                    (isToursActive && item.id === "tours")
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
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
