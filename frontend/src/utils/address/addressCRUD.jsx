import { axiosInstance } from "../../config/axiosInstance";

// for getting all addresses of a user
export const fetchUserAddresses = async () => {
  const response = await axiosInstance.get("/api/users/address");
  return response.data;
};

// for adding a new address
export const addNewAddress = async (address) => {
  const response = await axiosInstance.post("/api/users/address", address);
  return response.data;
};

// for updating a user's address
export const updateUserAddress = async (updatedAddress) => {
  console.log("in axios calling ==>", updatedAddress);
  const response = await axiosInstance.put(
    `/api/users/address/${updatedAddress._id}`,
    updatedAddress
  );
  return response.data;
};

// for deleting a user's address
export const deleteUserAddress = async (addressId) => {
  const response = await axiosInstance.delete(
    `/api/users/address/${addressId}`
  );
  return response.data;
};

// for getting user's default address
