import React from "react";
import { useNavigate } from "react-router-dom";

const BrandCard = ({ brand }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow text-center transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/products/brands/${brand._id}`)}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-1 sm:mb-2 md:mb-4 rounded-full overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/brands/${brand.logo}`}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 line-clamp-2">
        {brand.name}
      </h3>
    </div>
  );
};

export default BrandCard;
