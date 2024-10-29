import { adminAxiosInstance, axiosInstance } from "../../config/axiosInstance";

// for getting all coupons
export const getAllCoupons = async (currentPage, itemsPerPage) => {
  const response = await adminAxiosInstance.get("/api/admin/coupons", {
    params: {
      page: currentPage,
      limit: itemsPerPage,
    },
  });
  console.log(response.data);
  return response.data;
};

// for getting all coupons
export const getAllCouponsUser = async (currentPage, itemsPerPage) => {
  const response = await axiosInstance.get("/api/users/coupons", {
    params: {
      page: currentPage,
      limit: itemsPerPage,
    },
  });
  console.log(response.data);
  return response.data;
};

// for adding new coupon
export const addNewCoupon = async (coupon) => {
  const response = await adminAxiosInstance.post("/api/admin/coupons", coupon);
  return response.data;
};

// for updating coupon status
export const updateCouponStatus = async (couponId) => {
  const response = await adminAxiosInstance.patch("/api/admin/coupons", {
    couponId,
  });
  return response.data;
};

// for deleting coupon
export const deleteCoupon = async (couponId) => {
  console.log("api call to delete coupon with id: ", couponId);
  const response = await adminAxiosInstance.delete("/api/admin/coupons", {
    data: { couponId },
  });
  return response.data;
};

// apply coupon
export const applyCoupon = async (categoryInfo) => {
  const response = await axiosInstance.post("/api/users/coupons", categoryInfo);
  return response.data;
};
