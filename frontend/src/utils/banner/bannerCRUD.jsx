import { adminAxiosInstance, axiosInstance } from "../../config/axiosInstance";

// for getting all active banners
export const getActiveBanners = async (currentPage, itemsPerPage) => {
  const response = await adminAxiosInstance.get("/api/admin/banner", {
    currentPage,
    itemsPerPage,
  });
  return response.data;
};

// for adding new banner
export const newBanner = async (banner) => {
  const response = await adminAxiosInstance.post("/api/admin/banner", banner);
  return response.data;
};

// for deleting banner
export const deleteBanner = async (bannerId) => {
  const response = await adminAxiosInstance.delete("/api/admin/banner", {
    params: { bannerId },
  });
  return response.data;
};

// for updating banner status
export const updateBannerStatus = async (bannerId) => {
  const response = await adminAxiosInstance.patch("/api/admin/banner", {
    bannerId,
  });
  return response.data;
};

// for getting all active banners in user side
export const getUserActiveBanners = async () => {
  const response = await axiosInstance.get("/api/users/banner");
  return response.data;
};
