import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import BrandManagement from "../../components/admin/BrandManagement";

function Brand() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <BrandManagement />
        </div>
      </div>
    </div>
  );
}

export default Brand;
