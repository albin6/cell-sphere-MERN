import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import AddProductForm from "../../components/admin/AddProductForm";

function AddProduct() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="container mx-auto p-4">
          <AddProductForm />
        </main>
      </div>
    </div>
  );
}

export default AddProduct;
