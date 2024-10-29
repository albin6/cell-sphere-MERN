import React, { useState } from "react";
import { Label, Button } from "../ui/ui-components";
import { ShieldCheck } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

// Form validation schema using Yup
const NewPasswordSchema = Yup.object({
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
    .required("Confirm password is required"),
});

export default function NewPassword() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (values, { resetForm }) => {
    setError("");
    setMessage("");
    try {
      // Send the new password to the backend API
      const response = await axiosInstance.post("/api/users/reset-password", {
        id,
        password: values.password,
      });
      setMessage(response?.data?.message);
      resetForm();
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError("Failed to reset password.");
      resetForm();
    }
  };

  return (
    <div className="min-h-screen w-screen fixed bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full fixed content-center top-1/4 gap-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-200 h-[550px]">
        <div>
          <div className="flex flex-col justify-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-gray-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
          {error && (
            <div className="mt-3 text-base text-center text-red-600">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-3 text-base text-center text-green-600">
              {message}
            </div>
          )}
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={NewPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                      placeholder="New Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </Label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm New Password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Continue
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
