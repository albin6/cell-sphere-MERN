import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/products/${
            product.variants[0].images[0]
          }`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name} ({product.variants[0].ram} RAM,{" "}
          {product.variants[0].storage}, {product.variants[0].color})
        </h2>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-gray-600 text-xs sm:text-sm">2.8 (4)</span>
        </div>
        <div className="flex flex-wrap items-baseline mb-2">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
            ₹
            {(
              product?.price -
              (product?.price * product?.discount) / 100
            ).toFixed(2)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
            ₹{product?.price}
          </span>
          <span className="text-xs sm:text-sm text-green-600 ml-2">
            {product?.discount}% Off
          </span>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 flex items-center">
          <svg
            className="w-4 h-4 inline-block mr-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="flex-grow">Standard Delivery by Fri, 11th Oct</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
