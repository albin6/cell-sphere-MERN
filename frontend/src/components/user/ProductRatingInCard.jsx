import { Star } from "lucide-react";

const ProductRatingInCard = ({ product }) => {
  // Calculate the average rating outside of the JSX return
  const averageRating =
    product?.reviews.reduce((acc, review) => acc + review.rating, 0) /
    (product?.reviews.length || 1);

  // Determine full and half stars
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  return (
    <div className="flex items-center mb-2">
      {/* Render stars */}
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Star
              key={i}
              className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400"
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <Star
              key={i}
              className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400 opacity-50" // Optional: Use a different style for half star
            />
          );
        } else {
          return (
            <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
          );
        }
      })}
    </div>
  );
};

export default ProductRatingInCard;
