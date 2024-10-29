import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import CouponManagement from "../../components/admin/CouponMangement";

function CouponManagementPage() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
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
