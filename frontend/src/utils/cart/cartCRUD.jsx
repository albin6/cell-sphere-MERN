import { axiosInstance } from "../../config/axiosInstance";

// --------------------------------------------------------------
// for getting all products in the cart
// --------------------------------------------------------------
export const getCartProducts = async () => {
  const response = await axiosInstance.get("/api/users/cart");
  return response.data.cart_data;
};

// --------------------------------------------------------------
// for updating category quantity in the cart
// --------------------------------------------------------------
export const updateCartQuantity = async (product) => {
  const response = await axiosInstance.patch(`/api/users/cart/${product.sku}`, {
    quantity: product.quantity,
  });
  return response.data;
};

// --------------------------------------------------------------
// for removing products from the cart
// --------------------------------------------------------------
export const removeProduct = async (sku) => {
  const response = await axiosInstance.delete(`/api/users/cart/${sku}`);
  return response.data;
};
