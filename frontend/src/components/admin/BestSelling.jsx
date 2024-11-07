import React, { useEffect, useState } from "react";
import { adminAxiosInstance } from "../../config/axiosInstance";

function BestSelling() {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellingCategories, setBestSellingCategories] = useState([]);
  const [bestSellingBrands, setBestSellingBrands] = useState([]);
  useEffect(() => {
    const fetchBestSelling = async () => {
      const bestSellingResponse = await adminAxiosInstance.get(
        "/api/admin/best-selling"
      );
      const bestSellingData = bestSellingResponse.data;
      setBestSellingProducts(bestSellingData.products);
      setBestSellingCategories(bestSellingData.categories);
      setBestSellingBrands(bestSellingData.brands);
    };
    fetchBestSelling();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Best Selling Products</h3>
        <ul className="space-y-2">
          {bestSellingProducts.map((product) => (
            <li key={product._id} className="flex justify-between items-center">
              <span className="text-sm font-medium">{product.name}</span>
              <span className="text-sm font-semibold">
                {product.quantity_sold} units
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Best Selling Categories</h3>
        <ul className="space-y-2">
          {bestSellingCategories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-sm font-semibold">
                {category.totalSold} units
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Best Selling Brands</h3>
        <ul className="space-y-2">
          {bestSellingBrands.map((brand) => (
            <li key={brand._id} className="flex justify-between items-center">
              <span className="text-sm font-medium">{brand.name}</span>
              <span className="text-sm font-semibold">
                {brand.totalSold} units
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BestSelling;
