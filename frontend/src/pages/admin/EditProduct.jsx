import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import EditProductFormModal from "../../components/admin/EditProductForm";

function EditProduct() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="container mx-auto p-4">
          <EditProductFormModal />
        </main>
      </div>
    </div>
  );
}

export default EditProduct;
