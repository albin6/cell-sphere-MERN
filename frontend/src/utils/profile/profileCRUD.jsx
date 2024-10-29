import { axiosInstance } from "../../config/axiosInstance";

// for getting user information
export const fetchUserInformation = async () => {
  const response = await axiosInstance.get("/api/users/profile");
  console.log(response.data);
  return response.data;
};

// for updating user information
export const updateUserProfile = async (updatedUserData) => {
  console.log("in axios calling ==>", updatedUserData);
  const response = await axiosInstance.put(
    "/api/users/profile",
    updatedUserData
  );
  return response.data;
};
