import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import OfferModule from "../../components/admin/OfferModule";

function OfferModulePage() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <OfferModule />
        </div>
      </div>
    </div>
  );
}

export default OfferModulePage;
