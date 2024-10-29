import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import AddCategoryForm from "../../components/admin/AddCategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";

function Category() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Category Management</h1>
          <AddCategoryForm />
          <CategoryTable />
        </div>
      </div>
    </div>
  );
}

export default Category;
