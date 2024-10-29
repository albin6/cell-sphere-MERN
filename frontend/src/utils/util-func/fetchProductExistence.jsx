import { axiosInstance } from "../../config/axiosInstance";

export const fetchProductExistence = async (selectedVariant, product_id) => {
  try {
    const response = await axiosInstance.get("/api/users/cart-data", {
      params: {
        product_id,
        variant_sku: selectedVariant.sku,
      },
    });
    console.log("heloooo ividondeeeeeeee", response.data);
    return response.data;
  } catch (error) {
    if (error?.response?.status == 404) {
      console.log(
        "dheeeeeeeeeeeeeeeeeeeeeeeeeeeeee=>>>>>",
        error.response.data.message
      );
      return error.response.data.success;
    }
  }
};
