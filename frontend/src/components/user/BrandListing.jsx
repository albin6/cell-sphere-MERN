import React, { useState, useEffect, useContext } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useParams } from "react-router-dom";
import Error from "../Error";
import ProductListingShimmer from "../ui/ProductListingShimmer";
import CategoryProductCard from "./CategoryProductCard";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
import { searchContext } from "../../context/Search";

export default function BrandListing() {
  const { searchTerm } = useContext(searchContext);
  const { brandId } = useParams();
  const [brand, setBrand] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [storageExpanded, setStorageExpanded] = useState(false);
  const [ramExpanded, setRamExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 3;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    ram: [],
    storage: [],
  });

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  const fetchProducts = async (currentPage, itemsPerPage, sortBy) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/users/get-products-of-brand/${brandId}`,
        {
          params: {
            term: searchTerm,
            page: currentPage,
            limit: itemsPerPage,
            sort: sortBy,
            storage: filters.storage.join(","),
            ram: filters.ram.join(","),
          },
        }
      );

      setProducts(response.data.products);
      setBrand(response.data.products[0]?.brand?.name || "");
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsError(error?.response?.data?.message || "An error occurred");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, sortBy);
  }, [currentPage, sortBy, filters.storage, filters.ram, brandId]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      return updatedFilters;
    });
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  if (isLoading) {
    return <ProductListingShimmer />;
  }

  if (isError) {
    return (
      <Error
        error={isError}
        reset={() => fetchProducts(currentPage, itemsPerPage, sortBy)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <nav className="mb-4 sm:mb-6">
        <ul className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
          <li>
            <Link to="/">Home</Link>
          </li>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <li>Top Brands</li>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <li>{brand}</li>
        </ul>
      </nav>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside
          className={`lg:w-64 bg-white rounded-lg shadow-md ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Filters</h2>
            <div className="space-y-4">
              <FilterSection
                title="RAM"
                expanded={ramExpanded}
                setExpanded={setRamExpanded}
                options={["4GB", "6GB", "8GB", "12GB"]}
                selectedOptions={filters.ram}
                onChange={(value) => handleFilterChange("ram", value)}
              />
              <FilterSection
                title="Storage"
                expanded={storageExpanded}
                setExpanded={setStorageExpanded}
                options={["128GB", "256GB", "512GB"]}
                selectedOptions={filters.storage}
                onChange={(value) => handleFilterChange("storage", value)}
              />
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Products</h2>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={toggleFilters}
                className="lg:hidden flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Filters
              </button>
              <select
                className="block w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-xs sm:text-sm"
                value={sortBy}
                onChange={handleSort}
              >
                <option value="featured">Sort By: Featured</option>
                <option value="priceLowHigh">Sort By: Price Low-High</option>
                <option value="priceHighLow">Sort By: Price High-Low</option>
                <option value="new-arrivals">Sort By: New Arrivals</option>
                <option value="name-asc">Sort By: Name A to Z</option>
                <option value="name-desc">Sort By: Name Z to A</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <CategoryProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </main>
      </div>
    </div>
  );
}
