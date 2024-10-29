import { adminAxiosInstance } from "../../config/axiosInstance";

export const fetchCategories = async (currentPage, itemsPerPage) => {
  const response = await adminAxiosInstance.get("/api/admin/categories", {
    params: {
      page: currentPage,
      limit: itemsPerPage,
    },
  });
  return response.data;
};

export const submitCategoryForm = async (newCategory) => {
  const response = await adminAxiosInstance.post(
    "/api/admin/categories",
    newCategory
  );
  return response.data;
};

export const updateCategory = async (updatedCategory) => {
  const response = await adminAxiosInstance.put(
    "/api/admin/categories",
    updatedCategory
  );
  console.log("response of put request =>", response.data);
  return response.data.category_data;
};

export const updateCategoryStatus = async (categoryId) => {
  const response = await adminAxiosInstance.patch("/api/admin/categories", {
    categoryId,
  });
  console.log(response.data);
  return response.data.category_data;
};
