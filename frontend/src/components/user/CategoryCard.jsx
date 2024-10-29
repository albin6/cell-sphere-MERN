import React from "react";
import { Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow text-center flex flex-col justify-center transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/products/categories/${category._id}`)}
    >
      <Smartphone className="mx-auto w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-800" />
      <h3 className="font-semibold mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-800 line-clamp-2">
        {category.title}
      </h3>
    </div>
  );
};

export default CategoryCard;
