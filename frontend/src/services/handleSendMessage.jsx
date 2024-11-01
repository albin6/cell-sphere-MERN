import { axiosInstance } from "../config/axiosInstance";

export const handleSendMessage = async (message) => {
  try {
    const response = await axiosInstance.post("/api/users/chat", { message });
    console.log(response.data.response);
    return response.data.response;
  } catch (error) {
    console.error(error);
  }
};
