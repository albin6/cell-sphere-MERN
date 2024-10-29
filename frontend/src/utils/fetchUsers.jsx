import { adminAxiosInstance } from "../config/axiosInstance";

async function fetchUsers(currentPage, itemsPerPage) {
  try {
    const response = await adminAxiosInstance.get("/api/admin/users-list", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default fetchUsers;
