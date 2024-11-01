import React, { useState } from "react";
import { Button, Label } from "../ui/ui-components";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { adminAxiosInstance } from "../../config/axiosInstance";
import { useDispatch } from "react-redux";
import { setAdminDetails } from "../../redux/Slices/adminSlice";

// Form validation schema using Yup
const AdminLoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const handleSubmit = async (values) => {
    // Handle admin login logic here
    console.log("Admin login attempted with:", values);
    try {
      const response = await adminAxiosInstance.post(
        "/api/admin/login",
        values
      );
      console.log("response :", response);

      // Assuming login success
      if (response?.data) {
        dispatch(setAdminDetails(response?.data?.admin));
        console.log("Admin login successful:", response?.data?.admin);
      }
    } catch (error) {
      if (error?.response) {
        const status = error.response.status;
        console.log(status);
        const message = error.response.data.message;

        if (status === 404) {
          setError(message);
          console.log("404 state updated");
        } else if (status === 401) {
          setError(message);
        } else {
          setError(message);
        }
      } else {
        console.error("Error occurred:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-screen fixed bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full fixed content-center top-1/4 gap-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-200 h-[550px]">
        <div>
          <div className="flex flex-col justify-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-gray-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
              Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in with your admin credentials
            </p>
          </div>
          {error && (
            <div className="mt-3 text-base text-center text-red-600">
              {error}
            </div>
          )}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={AdminLoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                      placeholder="Admin Email address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                      placeholder="Admin Password"
                    />
                    <ErrorMessage
                      name="password"
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
                    Sign in as Admin
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Not an admin?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-800 hover:text-gray-700"
              >
                Go to user login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
