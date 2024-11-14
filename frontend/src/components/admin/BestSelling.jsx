"use client";

import React, { useEffect, useState } from "react";
import { adminAxiosInstance } from "../../config/axiosInstance";
import BestSellingSection from "./BestSellingSection";

export default function BestSelling() {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <BestSellingSection
        title="Best Selling Products"
        items={bestSellingProducts}
      />
      <BestSellingSection
        title="Best Selling Categories"
        items={bestSellingCategories}
      />
      <BestSellingSection
        title="Best Selling Brands"
        items={bestSellingBrands}
      />
    </div>
  );
}
