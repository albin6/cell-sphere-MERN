import { useState } from "react";
import { StarIcon } from "lucide-react";
import { useAllRatingAndReviewsMutation } from "../../../hooks/CustomHooks";
import { addNewRatingAndReview } from "../../../utils/reviews-and-ratings/reviewsCRUD";
import { toast } from "react-toastify";

export default function RatingProductModal({
  productName = "Sample Product",
  productId,
  onClose = () => {},
}) {
  const { mutate: addNewReview } = useAllRatingAndReviewsMutation(
    addNewRatingAndReview
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewReview(
      { rating, comment, productId },
      {
        onSuccess: () => toast.success("Review Added Successfully."),
        onError: () =>
          toast.error("Error while add review. Try again after sometimes"),
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Rate {productName}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      className="sr-only"
                      onChange={() => setRating(star)}
                    />
                    <StarIcon
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={rating === 0}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
