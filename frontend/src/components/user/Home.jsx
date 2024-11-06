import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Banner from "./Banner";
import { Button, Input } from "../ui/ui-components";
import { ChevronRight } from "lucide-react";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import BrandCard from "./BrandCard";
import { useUserProductsData } from "../../hooks/CustomHooks";
import { fetchProductsDetails } from "../../utils/products/userProductListing";
import ErrorBoundary from "../errorBoundaries/ErrorBoundary";
import Error from "../Error";
import Shimmer from "../ui/HomeShimmer";
import ReferralCode from "./ReferralCode";
import { axiosInstance } from "../../config/axiosInstance";

function Home() {
  const navigate = useNavigate();
  const { data, isError, isLoading, error } =
    useUserProductsData(fetchProductsDetails);
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);
  const [banners, setBanners] = useState([]);

  // referral modal show
  const [showModal, setShowModal] = useState(false);

  const hasSeenReferral = async () => {
    try {
      const response = await axiosInstance.get("/api/users/referral");
      console.log("referral status =>", response.data);
      if (!response.data.has_seen) {
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    hasSeenReferral();
  }, []);

  useEffect(() => {
    try {
      setProducts(data?.products || []);
      setCategories(data?.categories || []);
      setBrands(data?.brands || []);
      setBanners(data?.banners || []);
    } catch (error) {
      console.error("Error setting data:", error);
    }
  }, [data]);

  if (isLoading) {
    return <Shimmer />;
  }

  if (isError) {
    console.error("Error fetching data:", error);
    return <Error />;
  }

  return (
    <ErrorBoundary>
      <ReferralCode isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className="min-h-screen w-full bg-white text-gray-800">
        <Banner />

        {/* Category List */}
        <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {categories &&
              categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              For You...
            </h2>
            <Link to="/products/list">
              <Button
                variant="outline"
                className="border-gray-300 bg-gray-800 text-white hover:bg-gray-700"
              >
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </section>

        {/* Shop by Brand */}
        <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Top Brands
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {brands &&
              brands.map((brand) => (
                <BrandCard key={brand._id} brand={brand} />
              ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">
              Stay Updated
            </h2>
            <p className="mb-4 sm:mb-8 text-gray-600">
              Subscribe to our newsletter for the latest smartphone deals and
              updates
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-white text-gray-800 border-gray-300 focus:border-blue-500"
              />
              <Button
                type="submit"
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">
              Ready to Upgrade Your Phone?
            </h2>
            <p className="text-lg sm:text-xl mb-4 sm:mb-8 text-gray-600">
              Explore our wide selection of smartphones and find your perfect
              match
            </p>
            <Button
              className="bg-gray-800 hover:bg-gray-700 text-white text-center flex mx-auto"
              onClick={() => navigate("/products/list")}
            >
              Shop All Smartphones <ChevronRight className="ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}

export default Home;
