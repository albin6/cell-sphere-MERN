import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/Slices/userSlice";
import CreateUserIcon from "../../assets/CreateUserIcon";
import { axiosInstance } from "../../config/axiosInstance";
import { OTPModal } from "./OTPEnterModal";
import GoogleAuth from "../ui/google/GoogleAuth";
import { toast } from "react-toastify";

// Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name should only contain alphabets")
    .required("First name is required"),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name should only contain alphabets")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form_data, setFormData] = useState(null);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const handleSubmit = async (values) => {
    console.log("Signup attempted with:", values);
    setFormData((prev) => (prev = values));
    try {
      const response = await axiosInstance.post("/api/users/send-otp", {
        email: values.email,
      });
      if (response?.data?.success) {
        setIsOTPModalOpen(true);
        toast.success(response.data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.log(error);
    }
  };

  const handleOTPSubmit = async (otp) => {
    console.log("OTP submitted:", otp, form_data.email);
    try {
      // Here you would typically send the OTP to your backend for verification
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
        email: form_data.email,
      });
      console.log(response?.data);
      toast.success(response.data.message, { position: "top-center" });
      setIsOTPModalOpen(false);
      handleFormSubmit();
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.error("Error verifying OTP:", error);
    }
  };

  const resendOTPHandle = async () => {
    try {
      setOtpErrMessage("");
      const response = await axiosInstance.post("/api/users/send-otp", {
        email: form_data.email,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.log(error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const response = await axiosInstance.post("/api/users/signup", {
        first_name: form_data.firstName,
        last_name: form_data.lastName,
        email: form_data.email,
        phone_number: form_data.phoneNumber,
        password: form_data.password,
      });
      console.log(response.data);

      if (response?.data?.success) {
        dispatch(setUserDetails(response.data?.new_user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.log(error);
    }
    // Add your signup logic here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2 p-6">
            <img
              src="/Login-Signup/login.jpg"
              alt="Smartphone illustration"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12">
            <div className="flex flex-col justify-center mb-6">
              <CreateUserIcon className="mx-auto w-16 h-16" />
              <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
                Create an account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Join our smartphone community
              </p>
            </div>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-1/2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        className="mt-1 px-3 py-2 border rounded w-full"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        className="mt-1 px-3 py-2 border rounded w-full"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone number
                    </label>
                    <Field
                      name="phoneNumber"
                      type="text"
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm password
                    </label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={isSubmitting}
                  >
                    Sign up
                  </button>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <GoogleAuth />
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <OTPModal
              isOpen={isOTPModalOpen}
              closeModal={() => setIsOTPModalOpen(false)}
              onSubmit={handleOTPSubmit}
              onResendOTP={resendOTPHandle}
            />
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-medium text-gray-800 hover:text-gray-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
