import React, { useEffect, useState } from "react";
import { Button } from "../ui/ui-components";
import { Card, CardContent } from "../ui/ui-components";
import {
  useUserProductsData,
  useWishlistProduct,
  useWishlistProductMutation,
} from "../../hooks/CustomHooks";
import { axiosInstance } from "../../config/axiosInstance";
import { removeFromWishlist } from "../../utils/wishlist/wishlistCRUD";
import ProductCard from "./ProductCard";
import { fetchProductsDetails } from "../../utils/products/userProductListing";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoProductFoundUser from "./NoProductFound";

export default function Wishlist() {
  const navigate = useNavigate();
  const { data: wishlist, isError, isLoading } = useWishlistProduct();
  const { mutate: removeProduct } =
    useWishlistProductMutation(removeFromWishlist);
  const [products, setProducts] = useState([]);

  const { data } = useUserProductsData(fetchProductsDetails);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    try {
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error setting data:", error);
    }
  }, [data]);

  useEffect(() => {
    console.log(wishlistProducts);
    setWishlistProducts(wishlist?.filter((item) => item.product));
  }, [wishlist]);

  const addProductToCart = async (selectedVariant, product) => {
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
      removeProduct({
        productId: product._id,
        variant: selectedVariant.sku,
      });
      console.log("product removed from wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  const removeProductFromWishlist = (selectedVariant, product) => {
    removeProduct(
      {
        productId: product._id,
        variant: selectedVariant.sku,
      },
      {
        onSuccess: () =>
          toast.success("Product removed from cart", {
            position: "top-center",
          }),
      }
    );
    console.log("product removed from wishlist");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Wishlist ({wishlistProducts && wishlistProducts.length})
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {wishlistProducts && wishlistProducts.length > 0 ? (
          wishlistProducts.map((product) => (
            <Card key={product._id} className="flex items-center p-4">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                  product?.product?.variants.filter(
                    (variant) => variant.sku === product?.variant
                  )[0].images[0]
                }`}
                alt="Nothing Phone"
                width={80}
                height={80}
                className="mr-4"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">
                  {product?.product?.name} (
                  {
                    product?.product?.variants.filter(
                      (variant) => variant.sku === product?.variant
                    )[0].color
                  }
                  )
                </h3>
                <p className="text-sm text-gray-600">
                  {
                    product?.product?.variants.filter(
                      (variant) => variant.sku === product?.variant
                    )[0].ram
                  }{" "}
                  RAM |{" "}
                  {
                    product?.product?.variants.filter(
                      (variant) => variant.sku === product?.variant
                    )[0].storage
                  }{" "}
                  ROM
                </p>
                <p className="text-sm text-gray-600">(10854)</p>
                <p className="font-bold">
                  ₹
                  {
                    product?.product?.variants.filter(
                      (variant) => variant.sku === product?.variant
                    )[0].price
                  }
                </p>
                <p className="text-sm text-green-600">
                  {product?.product?.discount}% off
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() =>
                    removeProductFromWishlist(
                      product?.product?.variants.filter(
                        (variant) => variant.sku === product?.variant
                      )[0],
                      product?.product
                    )
                  }
                  variant="destructive"
                  className=" bg-gray-600 text-white"
                >
                  Remove
                </Button>
                <Button
                  onClick={() =>
                    addProductToCart(
                      product?.product?.variants.filter(
                        (variant) => variant.sku === product?.variant
                      )[0],
                      product?.product
                    )
                  }
                  variant="outline"
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Move To Cart
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <NoProductFoundUser />
        )}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Just For You</h2>

        <Button
          variant="link"
          className={"bg-gray-800 hover:bg-gray-700 text-white"}
          onClick={() => navigate("/products/list")}
        >
          See All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products &&
          products.slice(0, 4).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative w-full h-56 flex justify-center py-3 bg-gray-800">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                    product.variants[0].images[0]
                  }`}
                  alt={product.name}
                  className=" h-full object-cover"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < product.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <div className="text-sm text-gray-600">
                      <span className="line-through">
                        MRP: ₹
                        {(product.price / (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-green-600 text-sm">
                      (Save ₹
                      {(
                        product.price / (1 - product.discount / 100) -
                        product.price
                      ).toFixed(2)}
                      , {product.discount}% off)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
