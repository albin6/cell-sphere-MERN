import { adminAxiosInstance, axiosInstance } from "../../config/axiosInstance";

export const cancelOrder = async ({ orderId, sku }) => {
  const response = await axiosInstance.patch(`/api/users/orders/${orderId}`, {
    sku, // directly in the data payload
  });
  return response.data;
};

export const cancelOrderAdmin = async ({ orderId, sku }) => {
  const response = await adminAxiosInstance.patch(
    `/api/admin/orders/${orderId}/cancel`,
    {
      sku,
    }
  );
  return response.data;
};

export const changeOrderStatus = async ({ orderId, status, sku }) => {
  console.log(orderId, status, sku);
  const response = await adminAxiosInstance.patch(
    `/api/admin/orders/${orderId}/status`,
    { status, sku }
  );
  return response.data;
};

export const getOrderDetails = (orderId) => {
  return async function () {
    const response = await axiosInstance.get(`/api/users/orders/${orderId}`);
    return response.data.order_data;
  };
};

// ============================================================================
export const getOrders = async ({ currentPage, itemsPerPage }) => {
  const response = await adminAxiosInstance.get("/api/admin/orders", {
    params: {
      page: currentPage,
      limit: itemsPerPage,
    },
  });
  console.log(response.data);
  return response.data;
};

export const getOrdersUser = async () => {
  const response = await axiosInstance.get("/api/users/orders");
  console.log(response);
  return response.data.order_data;
};
