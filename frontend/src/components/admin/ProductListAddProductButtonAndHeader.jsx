import { PlusIcon } from "lucide-react";
import React from "react";

function ProductListAddProductButtonAndHeader({ handleAddProduct }) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"></h1>
        <button
          onClick={handleAddProduct}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>
    </>
  );
}

export default ProductListAddProductButtonAndHeader;
