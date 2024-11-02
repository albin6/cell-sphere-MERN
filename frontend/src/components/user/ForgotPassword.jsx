import React, { useState } from "react";
import { Button, Label } from "../ui/ui-components";
import { KeyRoundIcon } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "../../config/axiosInstance";
import { OTPModal } from "./OTPEnterModal";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Form validation schema using Yup for email
const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = async (values) => {
    console.log("Signup attempted with:", values);
    setFormData((prev) => (prev = values));
    try {
      const response = await axiosInstance.post(
        "/api/users/send-otp-forgotpassword",
        {
          email: values.email,
        }
      );
      setIsOTPModalOpen(true);
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      setIsOTPModalOpen(false);
      toast.error(error.response.data.message, { position: "top-center" });
      console.log(error);
    }
  };

  const handleFormSubmit = async (userId) => {
    navigate(`/users/reset-password/${userId}`);
  };

  const handleOTPSubmit = async (otp) => {
    console.log("OTP submitted:", otp, formData.email);
    try {
      // Here you would typically send the OTP to your backend for verification
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
        email: formData.email,
      });
      console.log(response?.data);
      toast.success(response.data.message, { position: "top-center" });
      setIsOTPModalOpen(false);
      handleFormSubmit(response.data.user._id);
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.error("Error verifying OTP:", error);
    }
  };

  const handleOTPResend = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/users/send-otp-forgotpassword",
        {
          email: formData.email,
        }
      );
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-screen fixed bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full fixed content-center top-1/4 gap-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-200 h-[400px]">
        <div>
          <div className="flex flex-col justify-center">
            <KeyRoundIcon className="mx-auto h-12 w-12 text-gray-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8">
                <div className="mb-6">
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="mb-5">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Verify Email
                  </Button>
                </div>
                <div>
                  <Link
                    to={"/login"}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Back to login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
          <OTPModal
            isOpen={isOTPModalOpen}
            closeModal={() => setIsOTPModalOpen(false)}
            onSubmit={handleOTPSubmit}
            onResendOTP={handleOTPResend}
          />
        </div>
      </div>
    </div>
  );
}
