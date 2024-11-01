import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Trash2, Search } from "lucide-react";
import OfferTable from "./OfferTable";
import { debounce } from "lodash";
import {
  useApplyOffer,
  useCategoriesForOffers,
  useProductOffers,
  useProductsForOffers,
} from "../../hooks/CustomHooks";
import { addOffer, deleteOffer } from "../../utils/offer/offerCRUD";
import { toast } from "react-toastify";

export default function OfferModule() {
  const [term, setTerm] = useState("");
  // =======================================================
  const { data: activeOffers } = useProductOffers();
  const { data: categoriesForOffers, refetch: refetchCategories } =
    useCategoriesForOffers();
  const {
    data: productsForOffers,
    isLoading,
    isError,
    refetch,
  } = useProductsForOffers(term);

  const { mutate: addNewOffer } = useApplyOffer(addOffer);
  const { mutate: removeOffer } = useApplyOffer(deleteOffer);
  // =======================================================
  const [activeTab, setActiveTab] = useState("product");
  const [offers, setOffers] = useState([]);

  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (activeOffers) {
      setOffers(activeOffers);
      console.log("offers set ==> ", activeOffers);
    }
    if (categoriesForOffers) {
      setCategories(categoriesForOffers);
      console.log("category set ==> ", categoriesForOffers);
    }
  }, [activeOffers, categoriesForOffers, activeTab]);

  const fetchProducts = async (term) => {
    if (activeTab === "product") {
      setTerm(term);
      refetch();
      console.log(`Searching for products with term: ${term}`);
    } else {
      setTerm(term);
      refetchCategories();
      console.log(`Searching for products with term: ${term}`);
    }
  };

  useEffect(() => {
    if (term && productsForOffers) {
      setSearchResults(productsForOffers);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [productsForOffers, term]);

  const debouncedFetchProducts = useCallback(
    debounce(async (term) => {
      if (term) {
        await fetchProducts(term);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchProducts(searchTerm);
  }, [searchTerm, debouncedFetchProducts]);

  const handleAddOffer = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("category"));
    const newOffer = {
      name: formData.get("name"),
      type: formData.get("type"),
      value: Number(formData.get("value")),
      target: activeTab,
      targetId:
        activeTab === "product"
          ? selectedProduct._id
          : formData.get("category"),
      targetName:
        activeTab === "product"
          ? selectedProduct.name
          : categories.find((c) => c._id === formData.get("category"))?.title,
      endDate: formData.get("endDate"),
    };
    console.log(newOffer);
    addNewOffer(newOffer, {
      onSuccess: () =>
        toast.success("Offer Added Successfully!", { position: "top-center" }),
    });
    event.currentTarget.reset();
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const handleDeleteOffer = (id) => {
    console.log("delete offer", id);
    removeOffer(id, {
      onSuccess: () => {
        toast.success("Offer Deleted Successfully!", {
          position: "top-center",
        });
      },
      onError: () =>
        toast.error("Error in deleting offer", { position: "top-center" }),
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setSearchResults([]);
    setTerm("");
    setShowResults(false);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setSearchResults([]);
      setTerm("");
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Offer Management</h1>
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "product"
              ? "border-b-2 border-gray-500 text-gray-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("product")}
        >
          Product Offers
        </button>
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "category"
              ? "border-b-2 border-gray-500 text-gray-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("category")}
        >
          Category Offers
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-2">Add New Offer</h2>
        <p className="text-gray-600 mb-4">
          Create a new offer for{" "}
          {activeTab === "product" ? "products" : "categories"}
        </p>
        <form onSubmit={handleAddOffer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Offer Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter offer name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Offer Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Select offer type</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700"
              >
                Offer Value
              </label>
              <input
                id="value"
                name="value"
                type="number"
                placeholder="Enter value"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            {/* <div className="space-y-2">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div> */}
            <div className="space-y-2">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor={activeTab}
              className="block text-sm font-medium text-gray-700"
            >
              {activeTab === "product" ? "Select Product" : "Select Category"}
            </label>
            {activeTab === "product" ? (
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search for a product"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                {showResults && searchResults && searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((product) => (
                      <li
                        key={product._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <select
                id="category"
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={activeTab === "product" && !selectedProduct}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Offer
          </button>
        </form>
      </div>

      <div className="mb-6">
        <div className="mt-4">
          {activeTab === "product" && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Product Offers</h2>
              <p className="text-gray-600 mb-4">
                Manage offers for specific products
              </p>
              <OfferTable
                productOrCategory={"product"}
                offers={
                  offers &&
                  offers.filter((offer) => offer.target_type === "product")
                }
                onDelete={handleDeleteOffer}
              />
            </div>
          )}
          {activeTab === "category" && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Category Offers</h2>
              <p className="text-gray-600 mb-4">
                Manage offers for product categories
              </p>
              <OfferTable
                productOrCategory={"category"}
                offers={offers.filter(
                  (offer) => offer.target_type === "category"
                )}
                onDelete={handleDeleteOffer}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
