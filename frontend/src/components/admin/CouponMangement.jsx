import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  useAllCoupons,
  useAllCouponsMutation,
  useCategoriesForOffers,
} from "../../hooks/CustomHooks";
import {
  addNewCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCouponStatus,
} from "../../utils/coupon/couponCRUD";
import { toast } from "react-toastify";
import Pagination from "../user/Pagination";
import ConfirmationModal from "./ConfirmationModal";

const CouponManagement = () => {
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // ============================================================
  const { data: categoriesForOffers } = useCategoriesForOffers();
  const { data: couponsData } = useAllCoupons(
    getAllCoupons,
    currentPage,
    itemsPerPage
  );
  const { mutate: addCoupon } = useAllCouponsMutation(addNewCoupon);
  const { mutate: updateStatus } = useAllCouponsMutation(updateCouponStatus);
  const { mutate: removeCoupon } = useAllCouponsMutation(deleteCoupon);
  // ============================================================
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isConfirmationStatusModalOpen, setIsConfirmationStatusModalOpen] =
    useState(false);
  const [isConfirmationOnDeleteModal, setIsConfirmationOnDeleteModal] =
    useState(false);
  const [couponId, setCouponId] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesForOffers) {
      setCategories(categoriesForOffers);
      console.log("category set ==> ", categoriesForOffers);
    }
  }, [categoriesForOffers]);

  useEffect(() => {
    if (couponsData) {
      console.log("Setting coupons state:", couponsData.coupons);
      setCoupons(couponsData.coupons);
      setCurrentPage(couponsData.currentPage);
      setTotalPages(couponsData.totalPages);
    }
  }, [couponsData]);

  useEffect(() => {
    console.log("coupons =>", coupons);
  }, [coupons]);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_amount: "",
    max_discount_amount: "",
    start_date: "",
    expiration_date: "",
    usage_limit: "",
    eligible_categories: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCoupon) {
      setFormData(editingCoupon);
    } else {
      resetForm();
    }
  }, [editingCoupon]);

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      min_purchase_amount: "",
      max_discount_amount: "",
      start_date: "",
      expiration_date: "",
      usage_limit: "",
      eligible_categories: [],
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    if (!formData.code) newErrors.code = "Description is required";

    if (!formData.description)
      newErrors.description = "Description is required";

    if (!formData.discount_value) {
      newErrors.discount_value = "Discount value is required";
    } else if (parseFloat(formData.discount_value) <= 0) {
      newErrors.discount_value = "Discount value must be positive";
    }

    if (parseFloat(formData.min_purchase_amount) < 0) {
      newErrors.min_purchase_amount =
        "Minimum purchase amount must be non-negative";
    }

    if (parseFloat(formData.max_discount_amount) < 0) {
      newErrors.max_discount_amount =
        "Maximum discount amount must be non-negative";
    }

    if (!formData.expiration_date) {
      newErrors.expiration_date = "Expiration date is required";
    } else if (new Date(formData.expiration_date) <= today) {
      newErrors.expiration_date = "Expiration date must be after today";
    }

    if (parseInt(formData.usage_limit) < 0) {
      newErrors.usage_limit = "Usage limit must be non-negative";
    }

    if (formData.eligible_categories.length === 0) {
      newErrors.eligible_categories = "At least one category must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      eligible_categories: prev.eligible_categories.includes(categoryId)
        ? prev.eligible_categories.filter((id) => id !== categoryId)
        : [...prev.eligible_categories, categoryId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingCoupon) {
        setCoupons(
          coupons.map((coupon) =>
            coupon.id === editingCoupon.id
              ? { ...formData, id: editingCoupon.id }
              : coupon
          )
        );
      } else {
        console.log(formData);
        addCoupon(formData, {
          onSuccess: () =>
            toast.success("Coupon Added Successfully!", {
              position: "top-center",
            }),
          onError: () =>
            toast.error("Error in adding coupon", { position: "top-center" }),
        });
      }
      setIsModalOpen(false);
      setEditingCoupon(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    setIsConfirmationOnDeleteModal(false);
    removeCoupon(couponId, {
      onSuccess: () =>
        toast.success("Coupon Deleted Successfully!", {
          position: "top-center",
        }),
      onError: () =>
        toast.error("Error in deleting coupon", { position: "top-center" }),
    });
  };

  const toggleCouponStatus = () => {
    setIsConfirmationStatusModalOpen(false);
    updateStatus(couponId, {
      onSuccess: () =>
        toast.success("Coupon status updated successfully!", {
          position: "top-center",
        }),
      onError: () =>
        toast.error("Error in updating coupon status", {
          position: "top-center",
        }),
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Coupon Management</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => {
          setEditingCoupon(null);
          setIsModalOpen(true);
        }}
      >
        <PlusIcon className="h-5 w-5 inline-block mr-2" />
        Add New Coupon
      </button>

      {/* Coupon Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Discount</th>
              <th className="py-3 px-6 text-left">Valid Period</th>
              <th className="py-3 px-6 text-left">Usage Limit</th>
              <th className="py-3 px-6 text-left">Eligible Categories</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {coupons.map((coupon) => (
              <tr
                key={coupon._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {coupon.code}
                </td>
                <td className="py-3 px-6 text-left">
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value}%`
                    : `₹${coupon.discount_value}`}
                </td>
                <td className="py-3 px-6 text-left">
                  {`${new Date(coupon.expiration_date).toLocaleDateString()}`}
                </td>
                <td className="py-3 px-6 text-left">{coupon.usage_limit}</td>
                <td className="py-3 px-6 text-left flex flex-col">
                  {coupon.eligible_categories.map((category) => (
                    <span key={category._id}>• {category.title}</span>
                  ))}
                </td>{" "}
                {/* eligible category */}
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      coupon.is_active
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex item-center">
                    <button
                      onClick={() => {
                        setCouponId(coupon._id);
                        setIsConfirmationOnDeleteModal(true);
                      }}
                      className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCouponId(coupon._id);
                        setIsConfirmationStatusModalOpen(true);
                      }}
                      className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                    >
                      {coupon.is_active ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isConfirmationStatusModalOpen && (
          <ConfirmationModal
            isOpen={isConfirmationStatusModalOpen}
            onClose={() => setIsConfirmationStatusModalOpen(false)}
            onConfirm={toggleCouponStatus}
          />
        )}
        {isConfirmationOnDeleteModal && (
          <ConfirmationModal
            isOpen={isConfirmationOnDeleteModal}
            onClose={() => setIsConfirmationOnDeleteModal(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>

      {/* Pagination */}
      {coupons.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}

      {/* Modal for adding/editing coupons */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4"
          id="my-modal"
        >
          <div className="relative mx-auto p-5 border shadow-lg rounded-md bg-white w-full max-w-4xl">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h3>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="code"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-xs italic">{errors.code}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="code"
                  >
                    Desciption
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs italic">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="discount_type"
                  >
                    Discount Type
                  </label>
                  <select
                    id="discount_type"
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="discount_value"
                  >
                    Discount Value
                  </label>
                  <input
                    type="number"
                    id="discount_value"
                    name="discount_value"
                    value={formData.discount_value}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.discount_value && (
                    <p className="text-red-500 text-xs italic">
                      {errors.discount_value}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="min_purchase_amount"
                  >
                    Minimum Purchase Amount
                  </label>
                  <input
                    type="number"
                    id="min_purchase_amount"
                    name="min_purchase_amount"
                    value={formData.min_purchase_amount}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.min_purchase_amount && (
                    <p className="text-red-500 text-xs italic">
                      {errors.min_purchase_amount}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="max_discount_amount"
                  >
                    Maximum Discount Amount
                  </label>
                  <input
                    type="number"
                    id="max_discount_amount"
                    name="max_discount_amount"
                    value={formData.max_discount_amount}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.max_discount_amount && (
                    <p className="text-red-500 text-xs italic">
                      {errors.max_discount_amount}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="expiration_date"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    id="expiration_date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.expiration_date && (
                    <p className="text-red-500 text-xs italic">
                      {errors.expiration_date}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="usage_limit"
                  >
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    id="usage_limit"
                    name="usage_limit"
                    value={formData.usage_limit}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.usage_limit && (
                    <p className="text-red-500 text-xs italic">
                      {errors.usage_limit}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <span className="block text-gray-700 text-sm font-bold mb-2">
                    Eligible Categories
                  </span>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category._id}`}
                          checked={formData.eligible_categories.includes(
                            category._id
                          )}
                          onChange={() => handleCategoryChange(category._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`category-${category._id}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {category.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.eligible_categories && (
                    <p className="text-red-500 text-xs italic">
                      {errors.eligible_categories}
                    </p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center justify-end space-x-2 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {editingCoupon ? "Update Coupon" : "Add Coupon"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCoupon(null);
                      resetForm();
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
