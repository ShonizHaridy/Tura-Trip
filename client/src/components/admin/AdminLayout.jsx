import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

const AdminLayout = ({ children, activeItem = "Dashboard" }) => {
  return (
    <div className="min-h-screen bg-isabeline-50 flex">
      {/* Sidebar */}
      <AdminSidebar activeItem={activeItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-[272px]">
        {/* Top Bar */}
        <AdminTopBar />

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 pt-[calc(68px+1.5rem)] lg:pt-[calc(68px+2rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;