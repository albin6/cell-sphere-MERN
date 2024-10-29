import React from "react";
import ProductListing from "./ProductListing";
import ProductListAddProductButtonAndHeader from "./ProductListAddProductButtonAndHeader";
import { useNavigate } from "react-router-dom";

function ProductListingWithAddProductButton() {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/admin/products/add-product");
  };
  return (
    <div className="container mx-auto p-4">
      <ProductListAddProductButtonAndHeader
        handleAddProduct={handleAddProduct}
      />
      <ProductListing />
    </div>
  );
}

export default ProductListingWithAddProductButton;
