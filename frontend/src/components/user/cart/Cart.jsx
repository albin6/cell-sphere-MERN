import { ChevronRight } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import CartItem from "./CartItem";
import {
  useCartProduct,
  useCartProductMutation,
} from "../../../hooks/CustomHooks";
import {
  removeProduct,
  updateCartQuantity,
} from "../../../utils/cart/cartCRUD";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { stockContext } from "../../../pages/user/CartPage";
import NoProductFound from "../NoProductFound";
import CartLoadingFallback from "./CartLoadingFallback";

const Cart = () => {
  const { stock } = useContext(stockContext);
  const navigate = useNavigate();
  const { data: products, isError, isLoading } = useCartProduct();
  const { mutate: updateCartProductQuantity } =
    useCartProductMutation(updateCartQuantity);
  const { mutate: removeProductFromCart } =
    useCartProductMutation(removeProduct);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log(products?.items);
    setCart(products);
  }, [products]);

  const removeFromCart = (sku) => {
    console.log(sku);

    removeProductFromCart(sku, {
      onSuccess: () =>
        toast.success("Product removed from cart", {
          position: "top-center",
        }),
    });
    console.log("product removed from cart");
  };

  const updateQuantity = (sku, newQuantity) => {
    console.log(sku, newQuantity);
    updateCartProductQuantity({ sku, quantity: newQuantity });
    console.log("update submitted");
  };

  if (isLoading) {
    return <CartLoadingFallback />;
  }

  if (isError) {
    return <NoProductFound />;
  }

  let subtotal;
  if (cart?.items) {
    subtotal = cart?.items.reduce(
      (sum, item) => sum + item.totalPrice * item.quantity,
      0
    );
  }
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <a href="/" className="hover:underline">
          Home
        </a>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Cart</span>
      </div>

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3 min-h-96">
          {cart?.items && cart.items.length > 0 ? (
            cart?.items.map((item) => (
              <CartItem
                key={item._id}
                product={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))
          ) : (
            <NoProductFound />
          )}
          {cart?.items && cart?.items.length > 0 && (
            <div className="text-right font-semibold text-xl mt-4">
              Total: ₹{total.toFixed(2)}
            </div>
          )}
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Cart Total</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>

              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>
                {cart?.totalAmount > 10000
                  ? "Free"
                  : `₹${cart?.discount?.toFixed(2) || 0}`}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>
                {shipping === 0 ? "Free" : `₹${shipping?.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total:</span>

              <span>₹{total.toFixed(2)}</span>
            </div>

            {(stock && stock.length !== 0) ||
            (cart?.items && cart?.items.length === 0) ? (
              <button
                className="w-full bg-gray-800 opacity-50 text-white py-2 rounded mt-6 hover:bg-gray-700 transition-colors"
                disabled
              >
                Proceed to checkout
              </button>
            ) : (
              <button
                className="w-full bg-gray-800 text-white py-2 rounded mt-6 hover:bg-gray-700 transition-colors"
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
