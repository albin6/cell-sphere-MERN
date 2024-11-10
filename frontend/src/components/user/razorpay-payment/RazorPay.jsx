import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config/axiosInstance";
import { useRazorpay } from "react-razorpay";

const RazorPay = ({ amount, handlePlaceOrder }) => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/api/users/get-user-info");
        console.log(response.data.user_data);
        setUserInfo({
          name:
            response.data.user_data.first_name +
            " " +
            response.data.user_data.last_name,
          email: response.data.user_data.email,
          contact: response.data.user_data.phone_number,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, []);

  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "",
      description: "",
      order_id: "",
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.contact,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      {isLoading && <p className="text-center">Loading Razorpay...</p>}
      {error && <p className="text-center">Error loading Razorpay: {error}</p>}
      <button
        className="py-2 bg-gray-700 text-white rounded hover:bg-gray-800 w-full"
        onClick={handlePayment}
        disabled={isLoading}
      >
        Pay Now
      </button>
    </div>
  );
};

export default RazorPay;
