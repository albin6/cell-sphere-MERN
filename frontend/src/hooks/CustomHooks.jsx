import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductsDetails } from "../utils/products/userProductListing";
import { fetchUserAddresses } from "../utils/address/addressCRUD";
import { fetchUserInformation } from "../utils/profile/profileCRUD";
import { getCartProducts } from "../utils/cart/cartCRUD";

import { getWishlistProducts } from "../utils/wishlist/wishlistCRUD";
import { axiosInstance } from "../config/axiosInstance";
import {
  getCategoriesForOffers,
  getOffers,
  getProductsForOffers,
} from "../utils/offer/offerCRUD";
import { getWalletBalance } from "../utils/wallet/walletCRUD";
import { getDashboardData } from "../utils/admin-dashboard/AdminDashboard";
import {
  getActiveBanners,
  getUserActiveBanners,
} from "../utils/banner/bannerCRUD";

export function useUserAuth() {
  const user = useSelector((state) => state.user.userInfo);
  return user;
}

// -----------------------------------------------------------
// for category
export const useCategoryList = (queryFunc, currentPage, itemsPerPage) => {
  return useQuery({
    queryKey: ["categories", currentPage, itemsPerPage],
    queryFn: () => queryFunc(currentPage, itemsPerPage),
  });
};

export const useCategoryListMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });
};
// -------------------------------------------------------------

// -------------------------------------------------------------
// for brand
export const useBrandList = (queryFunc, currentPage, itemsPerPage) => {
  return useQuery({
    queryKey: ["brands", currentPage, itemsPerPage],
    queryFn: () => queryFunc(currentPage, itemsPerPage),
  });
};

export const useBrandListMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("brands");
    },
  });
};
// -------------------------------------------------------------

// -------------------------------------------------------------
// for products
export const useProductsData = (queryFunc, currentPage, itemsPerPage) => {
  return useQuery({
    queryKey: ["products", currentPage, itemsPerPage],
    queryFn: () => queryFunc(currentPage, itemsPerPage),
  });
};

export const useProductsDataMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
  });
};
// --------------------------------------------------------------
// --------------------------------------------------------------
// for admin for getting the details of a single product
// for single product
export const useProductData = (queryFunc) => {
  return useQuery({
    queryKey: ["product"],
    queryFn: queryFunc,
  });
};

// --------------------------------------------------------------
// for user products
export const useUserProductsData = () => {
  return useQuery({
    queryKey: ["userProducts"],
    queryFn: fetchProductsDetails,
  });
};

// --------------------------------------------------------------

// --------------------------------------------------------------
// for user product details
export const useUserProduct = (queryFunc) => {
  return useQuery({
    queryKey: ["singleProduct"],
    queryFn: queryFunc,
  });
};
// --------------------------------------------------------------

// --------------------------------------------------------------

// --------------------------------------------------------------
// --------------------------------------------------------------
// for user for getting the details of products of a particular category of brand
export const useCategoryProduct = (queryFunc) => {
  return useQuery({
    queryKey: ["categoryProduct"],
    queryFn: queryFunc,
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for user profile address management
export const useProfileAddress = () => {
  return useQuery({
    queryKey: ["profileAddress"],
    queryFn: fetchUserAddresses,
  });
};

// for adding a new address to the user
export const useProfileAddressMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("profileAddress");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------

// for getting user information
export const useProfileInfo = () => {
  return useQuery({
    queryKey: ["profileInfo"],
    queryFn: fetchUserInformation,
  });
};

// for updating user information
export const useProfileInfoMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("profileInfo");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for getting products in cart

export const useCartProduct = () => {
  return useQuery({
    queryKey: ["cartProduct"],
    queryFn: getCartProducts,
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------

// for mutating the products in the cart

export const useCartProductMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("cartProduct");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for getting all products in wishlist
export const useWishlistProduct = () => {
  return useQuery({
    queryKey: ["wishlistProduct"],
    queryFn: getWishlistProducts,
  });
};

// for mutating wishlist products
export const useWishlistProductMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("wishlistProduct");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for getting order status
export const useOrderDetails = (queryFunc) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: queryFunc,
  });
};

// for canceling an order
export const useOrderDetailsMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for getting orders
export const useAllOrders = (queryFunc, currentPage, itemsPerPage) => {
  return useQuery({
    queryKey: ["allOrders", currentPage, itemsPerPage], // Include parameters in the queryKey
    queryFn: () => queryFunc({ currentPage, itemsPerPage }), // Pass parameters to the query function
    keepPreviousData: true, // Optional: Keeps previous data while fetching new
  });
};
export const useAllOrdersMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("allOrders");
    },
  });
};

// ----------------------------------------------------------
// ----------------------------------------------------------

// for getting the details of a product for direct checkout
export const useDirectCheckoutProduct = ({ variant, productId }) => {
  return useQuery({
    queryKey: ["directCheckoutProduct"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/api/users/get-variant-details-of-product",
        {
          params: {
            variant: variant,
            productId: productId,
          },
        }
      );
      return response.data.cart_data;
    },
  });
};

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// for getting offers applied on products
export const useProductOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
  });
};

// for getting products to apply offers on
export const useProductsForOffers = (term) => {
  return useQuery({
    queryKey: ["productsForOffers", term],
    queryFn: () => getProductsForOffers(term),
    enabled: !!term,
  });
};

// for getting categories to apply offers on
export const useCategoriesForOffers = () => {
  return useQuery({
    queryKey: ["categoriesForOffers"],
    queryFn: getCategoriesForOffers,
  });
};

// for applying offers on products
export const useApplyOffer = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "offers",
        "productsForOffers",
        "categoriesForOffers",
      ]);
    },
  });
};

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

// for getting all coupons
export const useAllCoupons = (queryFunc, currentPage, itemsPerPage) => {
  return useQuery({
    queryKey: ["allCoupons", currentPage, itemsPerPage],
    queryFn: () => queryFunc(currentPage, itemsPerPage),
  });
};

// for mutating coupons
export const useAllCouponsMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("allCoupons");
    },
  });
};

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

// for getting wallet details of user
export const useWalletBalance = () => {
  return useQuery({
    queryKey: ["walletBalance"],
    queryFn: getWalletBalance,
  });
};

// for adding balance to wallet
export const useAddWalletBalance = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("walletBalance");
    },
  });
};

// --------------------------------------------------------------

// for getting users count
export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });
};

// ----------------------------------------------------------------

// for getting banners
export const useBanners = (queryFunc, currentPage, itemsPerPage) => {
  return useQuery({
    queryKey: ["banners", currentPage, itemsPerPage],
    queryFn: () => queryFunc(currentPage, itemsPerPage),
  });
};

// for getting banners in user side
export const useUserBanners = () => {
  return useQuery({
    queryKey: ["userBanners"],
    queryFn: getUserActiveBanners,
  });
};

// for mutating banners
export const useBannersMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("banners");
      queryClient.invalidateQueries("userBanners");
    },
  });
};
