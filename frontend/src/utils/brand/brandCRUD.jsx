import { adminAxiosInstance } from "../../config/axiosInstance";

export const getBrandList = async (currentPage, itemsPerPage) => {
  const response = await adminAxiosInstance.get("/api/admin/brands", {
    params: {
      page: currentPage,
      limit: itemsPerPage,
    },
  });
  console.log(response.data);
  return response.data;
};

export const addNewBrand = async (brand) => {
  const response = await adminAxiosInstance.post("/api/admin/brands", brand, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data);
  return response.data.new_brand;
};

export const updateBrandStatus = async (id) => {
  const response = await adminAxiosInstance.patch("/api/admin/brands", { id });
  console.log(response.data);
  return response.data.brand_data;
};

export const updateBrand = async (brand_data) => {
  const response = await adminAxiosInstance.put(
    "/api/admin/brands",
    brand_data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
  return response.data.brand_data;
};
