import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CategoryProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative w-full h-40 sm:h-48 md:h-56 flex justify-center py-2 sm:py-3 bg-gray-800">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/products/${
            product.variants[0].images[0]
          }`}
          alt={product.name}
          className="h-full object-cover"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center mb-1 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
                i < product.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-0">
              ₹{product.price.toLocaleString()}
            </span>
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="line-through">
                MRP: ₹
                {(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <span className="text-green-600 text-xs sm:text-sm">
              (Save ₹
              {(
                product.price / (1 - product.discount / 100) -
                product.price
              ).toFixed(2)}
              , {product.discount}% off)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProductCard;
