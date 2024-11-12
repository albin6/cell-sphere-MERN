import { axiosInstance } from "../../config/axiosInstance";

export const getWalletBalance = async () => {
  const response = await axiosInstance.get("/api/users/wallet");
  return response.data.wallet;
};

// for adding funds to wallet
export const addFunds = async ({ amount, payment_status }) => {
  const response = await axiosInstance.put("/api/users/wallet", {
    amount,
    payment_status,
  });
  return response.data;
};
