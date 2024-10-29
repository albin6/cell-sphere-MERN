import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import OrderManagement from "../../components/admin/OrderManagement";

function OrderManagementPage() {
  return (
    <div className="flex  bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <OrderManagement />
        </div>
      </div>
    </div>
  );
}

export default OrderManagementPage;
