import React, { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import {
  useProductsData,
  useProductsDataMutation,
} from "../../hooks/CustomHooks";
import {
  fetchProductsData,
  unlistProduct,
} from "../../utils/products/adminProductListing";
import ErrorBoundary from "../errorBoundaries/ErrorBoundary";
import NoProducctsFound from "./NoProductsFound";
import ProductsFallbackLoading from "./ProductsFallbackLoading";
import ConfirmationModal from "./ConfirmationModal";
import Pagination from "../user/Pagination";

export default function ProductListing() {
  // ===========================================================================
  // ========================== for pagination =================================
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ===========================================================================
  const { data, isError, isLoading } = useProductsData(
    fetchProductsData,
    currentPage,
    itemsPerPage
  );
  const { mutate: updateProductStatus } =
    useProductsDataMutation(unlistProduct);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [noProducts, setNoProducts] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      if (data?.message) {
        setNoProducts(true);
      } else {
        setNoProducts(false);
        setProducts(data.products || []);
      }
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    }
  }, [data]);

  const handleEditProduct = (product) => {
    navigate(`/admin/products/edit-product/${product._id}`);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        filterCategory === "All" || product.category?.title === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock")
        return (a.variants[0]?.stock || 0) - (b.variants[0]?.stock || 0);
      return 0;
    });

  const handleConfirm = () => {
    setIsConfirmationModalOpen(false);
    updateProductStatus(orderId);
  };

  if (isLoading) {
    return <ProductsFallbackLoading />;
  }

  if (noProducts) {
    return (
      <NoProducctsFound
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        setSortBy={setSortBy}
        sortBy={sortBy}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="category-filter" className="font-medium">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort-by" className="font-medium">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Brand</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
              <th className="py-2 px-4 border-b text-left">
                Actions(Edit / Unlist)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      product.variants[0]?.images[0]
                    }`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category?.title}</td>
                <td className="py-2 px-4">{product.brand?.name}</td>
                <td className="py-2 px-4">₹{product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.variants[0]?.stock || 0}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center justify-evenly">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-white mr-2 px-2 py-1 rounded bg-gray-800 hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <div className="flex justify-center">
                      <Switch
                        checked={product.is_active}
                        onChange={() => {
                          setOrderId(product._id);
                          setIsConfirmationModalOpen(true);
                        }}
                        className={`${
                          product.is_active ? "bg-gray-800" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Toggle listing</span>
                        <span
                          className={`${
                            product.is_active
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
        {isConfirmationModalOpen && (
          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
