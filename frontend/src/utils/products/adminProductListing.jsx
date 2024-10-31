import { adminAxiosInstance } from "../../config/axiosInstance";

export const fetchProductsData = async (currentPage, itemsPerPage) => {
  const response = await adminAxiosInstance.get("/api/admin/products", {
    params: {
      page: currentPage,
      limit: itemsPerPage,
    },
  });
  return response.data;
};

export const addNewProduct = async (productData) => {
  const response = await adminAxiosInstance.post(
    "/api/admin/products",
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
};

export const fetchProductData = (productId) => {
  console.log("product Id", productId);
  return async function () {
    const response = await adminAxiosInstance.get(
      `/api/admin/products/${productId}`
    );
    console.log("ing vannn.....", response.data);
    return response.data;
  };
};

export const updateProduct = async ({ id, ...data }) => {
  console.log("before sending update===>", id, data);
  try {
    const response = await adminAxiosInstance.put(
      `/api/admin/products/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const unlistProduct = async (id) => {
  const response = await adminAxiosInstance.patch(`/api/admin/products/${id}`);
  console.log(response.data);
  return response.data;
};
