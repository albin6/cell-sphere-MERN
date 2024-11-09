import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NewPassword from "./NewPassword";
import { axiosInstance } from "../../../config/axiosInstance";

import { toast } from "react-toastify";
import CurrentPassword from "./CurrentPassword";

export default function ForgotPasswordFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState("currentPassword");

  const handlePasswordReset = async (password) => {
    // Here you would typically call an API to reset the password
    try {
      // Send the new password to the backend API

      const response = await axiosInstance.post(
        "/api/users/reset-the-password",
        {
          password,
        }
      );
      toast.success(response.data.message, {
        position: "top-center",
      });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCurrentPasswordSubmit = async (currentPassword) => {
    try {
      const response = await axiosInstance.post(
        "/api/users/check-current-password",
        {
          password: currentPassword,
        }
      );
      toast.success(response.data.message, {
        position: "top-center",
      });
      setStep("newPassword");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <Link
            to={"/profile"}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Profile
          </Link>
        </div>
        {step === "currentPassword" && (
          <CurrentPassword onSubmit={handleCurrentPasswordSubmit} />
        )}
        {step === "newPassword" && (
          <NewPassword onSubmit={handlePasswordReset} />
        )}
      </div>
    </div>
  );
}
