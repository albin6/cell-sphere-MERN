import { axiosInstance } from "../../config/axiosInstance";

export const getProductOfSpecificCategories = async (categoryId) => {
  const response = await axiosInstance.get("/api/users/get-category-products", {
    params: {
      categoryId,
    },
  });
  return response.data.products;
};
