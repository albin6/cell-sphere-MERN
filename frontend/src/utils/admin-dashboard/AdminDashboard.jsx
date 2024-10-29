import { adminAxiosInstance } from "../../config/axiosInstance";

export const getDashboardData = async () => {
  const response = await adminAxiosInstance.get("/api/admin/dashboard-data");
  return response.data;
};
