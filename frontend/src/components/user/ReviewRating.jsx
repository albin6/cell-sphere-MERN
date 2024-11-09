import { useEffect, useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import RateProductModal from "./rating-and-review/RatingProductModal";
import { useAllRatingAndReviews } from "../../hooks/CustomHooks";
import { getAllReviewsAndRating } from "../../utils/reviews-and-ratings/reviewsCRUD";

export default function ReviewRating({ productId }) {
  const [isRateProductModalOpen, setIsRateProductModalOpen] = useState(false);

  const { data: reviewsAndRatings } = useAllRatingAndReviews(
    getAllReviewsAndRating,
    productId
  );

  useEffect(() => {
    console.log(reviewsAndRatings);
  }, [reviewsAndRatings]);

  // Calculate average rating
  const averageRating =
    reviewsAndRatings?.reviews.reduce((acc, review) => acc + review.rating, 0) /
    (reviewsAndRatings?.reviews.length || 1);

  // Count ratings
  const ratingCounts = reviewsAndRatings?.reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    console.log("rating count dhaa====>", ratingCounts);
  }, [ratingCounts]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
          Ratings & Reviews
        </h2>
        <button
          onClick={() => setIsRateProductModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Rate Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <div className="flex items-center mb-4">
            <span className="text-4xl sm:text-5xl font-bold mr-2">
              {averageRating.toFixed(1)}
            </span>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-current" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            {reviewsAndRatings?.reviews.length || 0} Ratings & Reviews
          </p>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-2">
              <span className="w-3 text-sm">{rating}</span>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-1" />
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 ml-2">
                <div
                  className="bg-green-500 h-1.5 sm:h-2 rounded-full"
                  style={{
                    width: `${
                      (((ratingCounts && ratingCounts[rating]) || 0) /
                        (reviewsAndRatings?.reviews.length || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs sm:text-sm text-gray-600">
                {(ratingCounts && ratingCounts[rating]) || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 sm:mt-8 space-y-6">
        {reviewsAndRatings?.reviews.slice(0, 5).map((review, index) => (
          <div key={index} className="border-t pt-4 sm:pt-6">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < review.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="mb-2 text-sm sm:text-base">{review.comment}</p>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <span>
                {review.user.first_name + " " + review.user.last_name}
              </span>
              <span className="mx-2">•</span>
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            {/* Removed likes and dislikes as they're not in the new data structure */}
          </div>
        ))}
      </div>
      {isRateProductModalOpen && (
        <RateProductModal
          productId={productId}
          onClose={() => setIsRateProductModalOpen(false)}
        />
      )}
    </div>
  );
}
