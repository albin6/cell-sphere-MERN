import React, { useEffect, useState } from "react";
import { Button } from "../../ui/ui-components";
import { Input } from "../../ui/ui-components";
import { Label } from "../../ui/ui-components";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import {
  useProfileInfo,
  useProfileInfoMutation,
} from "../../../hooks/CustomHooks";
import {
  fetchUserInformation,
  updateUserProfile,
} from "../../../utils/profile/profileCRUD";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export default function ProfileTab() {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useProfileInfo(fetchUserInformation);
  const { mutate: updateProfile } = useProfileInfoMutation(updateUserProfile);

  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...data?.user_data,
    }));
  }, [data]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.firstName = "First name is required";
    if (!formData.last_name.trim())
      newErrors.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!/^\+?[\d\s]{10,14}$/.test(formData.phone_number))
      newErrors.phone = "Invalid phone number";
    return newErrors;
  };

  const handleSubmit = (e) => {
    setErrors({});
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      updateProfile(formData, {
        onSuccess: () => {
          setSuccessMessage("Profile updated successfully");
          setIsSubmitting(false);
        },
        onError: () => {
          toast.error("Failed to update profile. Please try again.", {
            position: "top-center",
          });
          setIsSubmitting(false);
        },
      });
    } else {
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        position: "top-center",
        pauseOnHover: true,
      });
      setSuccessMessage(""); // Reset success message after displaying the toast
    }
  }, [successMessage]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return <h3>Error...</h3>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="first_name"
            value={formData?.first_name}
            onChange={handleChange}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="last_name"
            value={formData?.last_name}
            onChange={handleChange}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData?.email}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone_number"
          value={formData?.phone_number}
          onChange={handleChange}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="submit"
          className="w-full md:w-auto bg-gray-800 text-white hover:bg-gray-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
        <span
          onClick={() => navigate("/profile/reset-password")}
          className="text-gray-800 text-base hover:underline hover:cursor-pointer"
        >
          Reset Password
        </span>
      </div>
    </form>
  );
}
