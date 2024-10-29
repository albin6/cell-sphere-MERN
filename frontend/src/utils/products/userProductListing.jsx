import { axiosInstance } from "../../config/axiosInstance";

export const fetchProductsDetails = async () => {
  const response = await axiosInstance.get("/api/users/get-products-details");
  return response.data;
};

export const fetchProduct = (productId) => {
  return async function () {
    const response = await axiosInstance.get(
      `/api/users/get-product/${productId}`
    );
    return response.data.product;
  };
};

export const fetchListingProducts = () => {
  return async function () {
    const response = await axiosInstance.get(
      `/api/users/get-products-of-category/`
    );
    console.log(response.data.products);
    return response.data.products;
  };
};
