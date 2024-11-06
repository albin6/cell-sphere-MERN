import { adminAxiosInstance } from "../../config/axiosInstance";

export const getOffers = async (page, limit) => {
  const response = await adminAxiosInstance.get("/api/admin/offers", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

// for adding an offer
export const addOffer = async (data) => {
  const response = await adminAxiosInstance.post("/api/admin/offers", data);
  return response.data;
};

// for getting products name for adding an offer
export const getProductsForOffers = async (term) => {
  const response = await adminAxiosInstance.get("/api/admin/products-data", {
    params: { searchTerm: term },
  });
  return response.data;
};

// for getting categories name for adding an offer
export const getCategoriesForOffers = async () => {
  const response = await adminAxiosInstance.get("/api/admin/categories-data");
  return response.data.categories_data;
};

// for deleting an offer
export const deleteOffer = async (offerId) => {
  console.log("api call to delete offer", offerId);
  const response = await adminAxiosInstance.delete("/api/admin/offers", {
    data: { offerId },
  });
  return response.data;
};
