import React, { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useBrandList, useBrandListMutation } from "../../hooks/CustomHooks";
import {
  addNewBrand,
  updateBrandStatus,
  updateBrand,
  getBrandList,
} from "../../utils/brand/brandCRUD";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import Pagination from "../user/Pagination";

const BrandManagement = () => {
  // ===========================================================================
  // ========================== for pagination =================================
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ===========================================================================
  const { data, isError } = useBrandList(
    getBrandList,
    currentPage,
    itemsPerPage
  );
  const { mutate: addBrand } = useBrandListMutation(addNewBrand);
  const { mutate: updateStatus } = useBrandListMutation(updateBrandStatus);
  const { mutate: updateBrandDetails } = useBrandListMutation(updateBrand);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (data) {
      setBrands(data.brands);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    }
  }, [data]);

  const handleConfirm = () => {
    setIsConfirmationModalOpen(false);
    updateStatus(orderId);
  };

  const handleAddBrand = (values, { resetForm }) => {
    console.log(values);
    const brand = {
      name: values.name,
      logo: values.logo,
      status: true,
    };
    addBrand(brand, {
      onSuccess: () =>
        toast.success("Brand Added Successfully!", { position: "top-center" }),
      onError: () =>
        toast.error("Brand already exists!", { position: "top-center" }),
    });
    resetForm();
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleUpdateBrand = (values) => {
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("name", values.name);

    if (values.logo) {
      formData.append("logo", values.logo);
    }

    updateBrandDetails(formData);
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Brand name must only contain alphabets")
      .required("Brand name is required"),
    logo: Yup.mixed()
      .required("Brand logo is required")
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // Allow for optional file
        const fileTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
        return fileTypes.includes(value.type);
      }),
  });

  // update validation schema
  const updateValidationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Brand name must only contain alphabets")
      .required("Brand name is required"),
    logo: Yup.mixed()
      .nullable()
      .notRequired()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // Allow for optional file
        const fileTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
        return fileTypes.includes(value.type);
      }),
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Brand Management</h2>

      {/* Add Brand Form */}
      <Formik
        initialValues={{ name: "", logo: null }}
        validationSchema={validationSchema}
        onSubmit={handleAddBrand}
      >
        {({ setFieldValue }) => (
          <Form className="mb-8">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex flex-col w-full md:w-1/2">
                <Field
                  type="text"
                  name="name"
                  placeholder="Brand Name"
                  className="w-full px-3 py-2 h-12 border rounded-md"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="flex flex-col w-full md:w-1/3">
                <input
                  type="file"
                  accept="image/*"
                  name="logo"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    if (file) {
                      setFieldValue("logo", file);
                    }
                  }}
                  className="w-full px-3 py-2 max-h-12 border rounded-md"
                />
                <ErrorMessage
                  name="logo"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <button
                type="submit"
                className="mt-4 md:mt-0 md:ml-4 px-4 py-2 bg-gray-800 h-12 text-white rounded-md hover:bg-gray-600"
              >
                Add Brand
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Brands Table */}
      {!isError && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Logo</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand._id} className="border-b">
                  <td className="px-4 py-2">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/brands/${
                        brand.logo
                      }`}
                      alt={brand.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">{brand.name}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <Switch
                        checked={brand.status}
                        onChange={() => {
                          setOrderId(brand._id);
                          setIsConfirmationModalOpen(true);
                        }}
                        className={`${
                          brand.status ? "bg-gray-800" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Toggle listing</span>
                        <span
                          className={`${
                            brand.status ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleEditBrand(brand)}
                        className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-600"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {brands.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}

      {/* Edit Brand Modal */}
      {isModalOpen && editingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Edit Brand</h3>
            <Formik
              initialValues={{
                id: editingBrand._id,
                name: editingBrand.name,
                logo: null,
              }}
              validationSchema={updateValidationSchema}
              onSubmit={handleUpdateBrand}
            >
              {({ setFieldValue }) => (
                <Form>
                  <Field
                    type="text"
                    name="name"
                    value={editingBrand.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFieldValue("name", newName); // Update Formik state
                      setEditingBrand({ ...editingBrand, name: newName }); // Update local state
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-4"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditingBrand({
                            ...editingBrand,
                            logo: reader.result,
                          });
                          setFieldValue("logo", file);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-4"
                  />

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default BrandManagement;
