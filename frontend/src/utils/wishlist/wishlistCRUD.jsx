import { axiosInstance } from "../../config/axiosInstance";

// for getting all products in wishlist
export const getWishlistProducts = async () => {
  const response = await axiosInstance.get("/api/users/wishlists");
  return response.data.wishlists[0].items;
};

// for add products to wishlist
export const addProductToWishlist = async (data) => {
  const response = await axiosInstance.post("/api/users/wishlists", {
    productId: data.product,
    variant: data.variant,
  });
  return response.data;
};

// for removing products from wishlist
export const removeFromWishlist = async (data) => {
  console.log("onn nokkkk", data);
  const response = await axiosInstance.delete("/api/users/wishlists", {
    data: {
      productId: data.productId,
      variant: data.variant,
    },
  });
  return response.data;
};

export const productExistence = async (data) => {
  try {
    const response = await axiosInstance.get(
      "/api/users/wishlists/product-existence",
      {
        params: {
          productId: data.product,
          variant: data.variant,
        },
      }
    );
    return response.data.isInWishlist;
  } catch (error) {
    console.log(error);
    return false;
  }
};
