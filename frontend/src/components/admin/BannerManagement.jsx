import React, { useEffect, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { useBanners, useBannersMutation } from "../../hooks/CustomHooks";
import {
  deleteBanner,
  getActiveBanners,
  newBanner,
  updateBannerStatus,
} from "../../utils/banner/bannerCRUD";
import Pagination from "../user/Pagination";
import { Image, Transformation } from "cloudinary-react";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import { Switch } from "@headlessui/react";

function BannerManagement() {
  // ===========================================================================
  // ========================== for pagination =================================
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ===========================================================================
  const [file, setFile] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [updateConfirmationModalOpen, setUpdateConfirmationModalOpen] =
    useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState(null);
  const [bannerIdToUpdate, setBannerIdToUpdate] = useState(null);

  const { data, isLoading, isError, refetch } = useBanners(
    getActiveBanners,
    currentPage,
    itemsPerPage
  );
  const { mutate: addBanner } = useBannersMutation(newBanner);
  const { mutate: deleteABanner } = useBannersMutation(deleteBanner);
  const { mutate: updateStatus } = useBannersMutation(updateBannerStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    status: true,
    heading_one: "",
    heading_four: "",
    expires_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    console.log(data);
    setBanners(data?.banners);
    setTotalPages(data?.totalPages);
    setCurrentPage(data?.currentPage);
  }, [data]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = () => {
    setUpdateConfirmationModalOpen(false);
    updateStatus(bannerIdToUpdate, {
      onSuccess: () => {
        toast.success("Status updated successfully", {
          position: "top-center",
        });
        refetch();
      },
      onError: () =>
        toast.error("Error in status update", { position: "top-center" }),
    });
  };

  const handleDelete = () => {
    console.log(bannerIdToDelete);
    setConfirmationModalOpen(false);
    deleteABanner(bannerIdToDelete, {
      onSuccess: () =>
        toast.success("Banner Delete Success", { position: "top-center" }),
      onError: () =>
        toast.error("Error while deleting banner", { position: "top-center" }),
    });
  };

  const handleSubmit = async (e) => {
    setConfirmationModalOpen(false);
    e.preventDefault();
    try {
      console.log(formData);
      const images = new FormData();
      images.append("file", file);
      images.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      images.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUDNAME);

      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: images,
      });
      const data = await res.json();

      const updatedFormData = {
        ...formData,
        image: data.secure_url,
      };
      console.log(updatedFormData);
      addBanner(updatedFormData, {
        onSuccess: () =>
          toast.success("Banner Added Successfully", {
            position: "top-center",
          }),
      });
      setIsModalOpen(false);
      setFormData({
        description: "",
        status: true,
        heading_one: "",
        heading_four: "",
        expires_at: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return <h3>Error...</h3>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Banner
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Banner</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Heading
                  </label>
                  <input
                    type="text"
                    name="heading_one"
                    value={formData.heading_one}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Heading
                  </label>
                  <input
                    type="text"
                    name="heading_four"
                    value={formData.heading_four}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Active
                    </span>
                  </label>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Add Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {confirmationModalOpen && (
        <ConfirmationModal
          isOpen={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {updateConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={updateConfirmationModalOpen}
          onClose={() => setUpdateConfirmationModalOpen(false)}
          onConfirm={handleStatusChange}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Primary Heading
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Secondary Heading
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners && banners.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No banners found. Add your first banner to get started.
                </td>
              </tr>
            ) : (
              banners &&
              banners.map((banner) => (
                <tr key={banner._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={banner.image}
                      alt={banner.heading_one}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {banner.heading_one}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.heading_four}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {banner.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(banner.expires_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <Switch
                        checked={banner.status}
                        onChange={() => {
                          setBannerIdToUpdate(banner._id);
                          setUpdateConfirmationModalOpen(true);
                        }}
                        className={`${
                          banner.status ? "bg-gray-800" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Toggle listing</span>
                        <span
                          className={`${
                            banner.status ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        setBannerIdToDelete(banner._id);
                        setConfirmationModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {banners && banners.length !== 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
}

export default BannerManagement;
