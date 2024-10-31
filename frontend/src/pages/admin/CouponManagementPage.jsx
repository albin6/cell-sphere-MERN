import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import CouponManagement from "../../components/admin/CouponMangement";
import { Menu } from "lucide-react";

function CouponManagementPage() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const closeSidebar = () => setSideBarOpen(false);
  return (
    <div className="flex bg-gray-100">
      <div className="hidden md:flex">
        <Sidebar open={true} onClose={closeSidebar} />
      </div>

      {/* Toggle Button for Sidebar (only visible on mobile) */}
      <button
        className="flex md:hidden rounded bg-gray-800 text-white h-8 absolute w-8 justify-center items-center transition-colors top-4 left-4"
        onClick={toggleSideBar}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar for mobile (visible only when sideBarOpen is true) */}
      {sideBarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-75">
          <Sidebar open={sideBarOpen} onClose={closeSidebar} />
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <CouponManagement />
        </div>
      </div>
    </div>
  );
}

export default CouponManagementPage;
