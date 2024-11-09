import { axiosInstance } from "../../config/axiosInstance";

export const getAllReviewsAndRating = async (productId) => {
  const response = await axiosInstance.get("/api/users/reviews", {
    params: {
      productId,
    },
  });
  return response.data;
};

export const addNewRatingAndReview = async ({ rating, comment, productId }) => {
  const response = await axiosInstance.post("/api/users/reviews", {
    rating,
    comment,
    productId,
  });
  return response.data;
};
