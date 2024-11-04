import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useUserProduct,
  useUserProductsData,
  useWishlistProduct,
  useWishlistProductMutation,
} from "../../hooks/CustomHooks";
import {
  fetchProduct,
  fetchProductsDetails,
} from "../../utils/products/userProductListing";
import {
  Heart,
  Share2,
  ChevronUp,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Checkbox,
  Label,
  Card,
  CardContent,
  Button,
} from "../ui/ui-components";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useMouseOverZoom } from "../../hooks/useMouseOverZoom";
import ProductCard from "./ProductCard";
import { axiosInstance } from "../../config/axiosInstance";
import ReviewRating from "./ReviewRating";

import { fetchProductExistence } from "../../utils/util-func/fetchProductExistence";
import {
  addProductToWishlist,
  productExistence,
  removeFromWishlist,
} from "../../utils/wishlist/wishlistCRUD";
import { toast } from "react-toastify";

// Corrected useMouseOverZoom hook

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: product, isLoading, error } = useUserProduct(fetchProduct(id));

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [availableRam, setAvailableRam] = useState([]);
  const [availableStorage, setAvailableStorage] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [isProductExists, setIsProductExists] = useState(false);

  const [isProductExistsInWishlist, setIsProductExistsInWishlist] =
    useState(false);

  const { mutate: addToWishList } =
    useWishlistProductMutation(addProductToWishlist);

  const { mutate: removeProduct } =
    useWishlistProductMutation(removeFromWishlist);

  const { data: forChecking } = useWishlistProduct();

  const { data } = useUserProductsData(fetchProductsDetails);
  useEffect(() => {
    try {
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error setting data:", error);
    }
  }, [data]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedColor(firstVariant.color);
      setSelectedRam(firstVariant.ram);
      setSelectedStorage(firstVariant.storage);
      updateAvailableOptions(firstVariant.color);
    }
  }, [product]);

  const updateAvailableOptions = (color) => {
    const variantsForColor = product.variants.filter((v) => v.color === color);
    const ramOptions = [...new Set(variantsForColor.map((v) => v.ram))];
    setAvailableRam(ramOptions);
    setSelectedRam(ramOptions[0]);

    const storageOptions = [
      ...new Set(
        variantsForColor
          .filter((v) => v.ram === ramOptions[0])
          .map((v) => v.storage)
      ),
    ];
    setAvailableStorage(storageOptions);
    setSelectedStorage(storageOptions[0]);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    updateAvailableOptions(color);
    setCurrentImageIndex(0);
  };

  const handleRamChange = (ram) => {
    setSelectedRam(ram);
    const storageOptions = [
      ...new Set(
        product.variants
          .filter((v) => v.color === selectedColor && v.ram === ram)
          .map((v) => v.storage)
      ),
    ];
    setAvailableStorage(storageOptions);
    setSelectedStorage(storageOptions[0]);
  };

  const handleStorageChange = (storage) => {
    setSelectedStorage(storage);
  };

  const getSelectedVariant = () => {
    return product?.variants.find(
      (v) =>
        v.color === selectedColor &&
        v.ram === selectedRam &&
        v.storage === selectedStorage
    );
  };

  const nextImage = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % selectedVariant.images.length
      );
    }
  };

  const prevImage = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedVariant.images.length) %
          selectedVariant.images.length
      );
    }
  };

  const addProductToCart = async (selectedVariant) => {
    try {
      console.log(selectedVariant);

      console.log(product);
      const response = await axiosInstance.post("/api/users/cart", {
        selectedVariant,
        product,
      });

      toast.success("Product added to cart", {
        position: "top-center",
      });
      console.log("product added to cart", response);
      setIsProductExists(true);
    } catch (error) {
      console.log(error);
    }
  };

  const notifyStockout = () => {
    toast.error("Product is out of stock", {
      position: "top-center",
    });
  };

  const sourceRef = React.useRef(null);
  const targetRef = React.useRef(null);
  const cursorRef = React.useRef(null);

  const { isActive } = useMouseOverZoom(sourceRef, targetRef, cursorRef);

  useEffect(() => {
    // Ensure the canvas is the right size
    if (targetRef.current) {
      targetRef.current.width = 400;
      targetRef.current.height = 400;
    }
  }, []);

  const addToWishlist = (currentVariant) => {
    console.log("in add to wishlist=>", product);
    console.log(currentVariant);
  };

  const checkAddToCart = () => {
    if (isProductExists) {
      navigate("/cart");
    } else {
      addProductToCart(selectedVariant);
    }
  };

  const selectedVariant = getSelectedVariant();

  const averageRating =
    product?.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product?.reviews.length;

  const handleProductCheckout = () => {
    console.log("buy now clicked");
    console.log(id);
    navigate(`/checkout?productId=${id}&currVariant=${selectedVariant.sku}`);
  };

  useEffect(() => {
    const response = fetchProductExistence(selectedVariant, product?._id);
    response.then((data) => {
      if (data) {
        setIsProductExists(true);
      } else {
        setIsProductExists(false);
      }
    });
  }, [selectedVariant, product?._id]);

  useEffect(() => {
    const isExists = productExistence({
      product: product?._id,
      variant: selectedVariant?.sku,
    });

    isExists.then((data) => {
      console.log("product ondoooo????", isExists);
      setIsProductExistsInWishlist(data);
    });
  }, [forChecking, selectedVariant, product]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  if (!product)
    return (
      <div className="flex items-center justify-center h-screen">
        No product found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <nav className="mb-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>{product.category.title}</li>
          <ChevronRight className="w-4 h-4" />
          <li>{product.brand.name}</li>
        </ul>
      </nav>
      <canvas
        ref={targetRef}
        width="400"
        height="400"
        className="absolute bg-white pointer-events-none bottom-full translate-y-1/2 left-3/4 md:-translate-y-3/4 md:translate-x-0 md:bottom-16 md:left-1/2 border-8 w-2/5 h-96 z-10"
        style={{
          display: isActive ? "block" : "none",
        }}
      />
      <div className="grid gap-8 lg:grid-cols-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 max-w-[750px] mx-auto">
          {selectedVariant && (
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative aspect-square">
                <img
                  ref={sourceRef}
                  src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                    selectedVariant.images[currentImageIndex]
                  }`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <div
                  ref={cursorRef}
                  className="absolute pointer-events-none border-2 border-white rounded-full"
                  style={{
                    display: isActive ? "block" : "none",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevImage}
                  className="absolute rounded-full bg-white/80 hover:bg-white left-2 top-1/2 transform -translate-y-1/2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextImage}
                  className="absolute rounded-full bg-white/80 hover:bg-white right-2 top-1/2 transform -translate-y-1/2"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </CardContent>
            </Card>
          )}
          {selectedVariant && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedVariant.images.map((image, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-16 h-16 sm:w-20 sm:h-20 p-0 rounded-lg overflow-hidden"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={`${
                      import.meta.env.VITE_API_BASE_URL
                    }/products/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 max-w-[750px] mx-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              <span>{product.name} </span>
              {selectedVariant && (
                <span className="text-base sm:text-lg text-gray-600">
                  ({selectedVariant.ram} RAM, {selectedVariant.storage},{" "}
                  {selectedVariant.color})
                </span>
              )}
            </h1>
          </div>
          <div className="flex justify-between">
            {(selectedVariant && selectedVariant?.stock == 0 && (
              <span className="text-lg text-red-600">Stock out!!!</span>
            )) ||
              (selectedVariant && selectedVariant?.stock <= 10 && (
                <span className="text-lg text-red-600">
                  Only {selectedVariant?.stock} left!!!
                </span>
              ))}
            {selectedVariant && selectedVariant?.stock > 10 && (
              <span className="text-lg text-green-600">In Stock</span>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                {isProductExistsInWishlist ? (
                  <Heart
                    className="h-6 w-6 fill-red-600 stroke-none"
                    onClick={() =>
                      removeProduct(
                        {
                          productId: product._id,
                          variant: selectedVariant.sku,
                        },
                        {
                          onSuccess: () =>
                            toast.warn("Product Removed From Wishlist"),
                        }
                      )
                    }
                  />
                ) : (
                  <Heart
                    className="h-6 w-6"
                    onClick={() =>
                      addToWishList(
                        {
                          product: product._id,
                          variant: selectedVariant.sku,
                        },
                        {
                          onSuccess: () =>
                            toast.success("Product Added to Wishlist"),
                        }
                      )
                    }
                  />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              ₹
              {selectedVariant &&
                (
                  selectedVariant.price -
                  (selectedVariant.price * product.discount) / 100
                ).toFixed(2)}
            </span>
            <span className="text-sm text-gray-600 ml-2">
              (Incl. all Taxes)
            </span>
            <div className="text-sm text-gray-600 mt-1">
              <span className="line-through">
                MRP: ₹{selectedVariant && selectedVariant.price}
              </span>
              <span className="text-green-600 ml-2">
                (Save ₹
                {selectedVariant &&
                  ((selectedVariant.price * product.discount) / 100).toFixed(2)}
                , {product.discount}% off)
              </span>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <span className="font-semibold">
                  Delivery at: Mumbai, 400049
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Will be delivered by{" "}
                {new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="font-bold text-lg mb-3">Key Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <li>
                  <span className="font-semibold">Display:</span>{" "}
                  {product.specifications.display.size},{" "}
                  {product.specifications.display.resolution},{" "}
                  {product.specifications.display.type}
                </li>
                {selectedVariant && (
                  <li>
                    <span className="font-semibold">Memory:</span>{" "}
                    {selectedVariant.ram} RAM, {selectedVariant.storage} ROM
                  </li>
                )}
                <li>
                  <span className="font-semibold">Processor:</span>{" "}
                  {product.specifications.processor}
                </li>
                <li>
                  <span className="font-semibold">Camera:</span>{" "}
                  {product.specifications.camera.rear},{" "}
                  {product.specifications.camera.front} Front
                </li>
                <li>
                  <span className="font-semibold">Battery:</span>{" "}
                  {product.specifications.battery}
                </li>
                <li>
                  <span className="font-semibold">OS:</span>{" "}
                  {product.specifications.os}
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg mb-2">Color</h2>
              <RadioGroup
                value={selectedColor}
                onValueChange={handleColorChange}
                className="flex flex-wrap gap-2"
              >
                {[...new Set(product.variants.map((v) => v.color))].map(
                  (color) => (
                    <div key={color}>
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-gray-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                      >
                        {color}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">RAM</h2>
              <RadioGroup
                value={selectedRam}
                onValueChange={handleRamChange}
                className="flex flex-wrap gap-2"
              >
                {availableRam.map((ram) => (
                  <div key={ram}>
                    <RadioGroupItem
                      value={ram}
                      id={`ram-${ram}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`ram-${ram}`}
                      className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-gray-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                    >
                      {ram}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">Internal Storage</h2>
              <RadioGroup
                value={selectedStorage}
                onValueChange={handleStorageChange}
                className="flex flex-wrap gap-2"
              >
                {availableStorage.map((storage) => (
                  <div key={storage}>
                    <RadioGroupItem
                      value={storage}
                      id={`storage-${storage}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`storage-${storage}`}
                      className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-gray-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                    >
                      {storage}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">Description</h2>
            <p className="text-sm  text-gray-600">{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={
                selectedVariant?.stock == 0
                  ? notifyStockout
                  : handleProductCheckout
              }
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
            >
              Buy Now
            </Button>

            <Button
              onClick={
                selectedVariant?.stock == 0 ? notifyStockout : checkAddToCart
              }
              variant="outline"
              className="flex-1 border-gray-600 text-gray-600 hover:bg-blue-50"
            >
              {isProductExists ? "Goto Cart" : "Add to Cart"}
            </Button>
          </div>

          <ReviewRating />
        </div>
      </div>
      <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-gray-50">
        <Link to="/products/list">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Related Products...
            </h2>
            <Button
              variant="outline"
              className="border-gray-300 bg-gray-800 text-white hover:bg-gray-700"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
            {products &&
              products
                .slice(0, 5)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </Link>
      </section>
    </div>
  );
}

export default ProductDetails;
