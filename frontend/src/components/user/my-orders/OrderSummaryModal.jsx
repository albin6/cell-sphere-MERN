import { CheckCircleIcon } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "../../../config/axiosInstance";
import { toast } from "react-toastify";
import PaypalCheckout from "../paypal-payment/PaypalCheckout";

const OrderSummaryModal = ({
  cart,
  subtotal,
  shipping,
  coupon,
  total,
  paymentMethod,
  selectedAddress,
  onClose,
  onPlace,
}) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handlePlaceOrder = async () => {
    try {
      console.log("cart===>", cart);
      console.log("selectedAddress===>", selectedAddress);
      console.log("subtotal===>", subtotal);
      console.log("shipping===>", shipping);
      console.log("totoal===>", total);
      console.log("paymentMethod===>", paymentMethod);

      const totalProductsPrice = cart.items.reduce(
        (acc, curr) => acc + curr.price,
        0
      );

      const totalProductsPriceAfterDiscount = cart.items.reduce(
        (acc, curr) => acc + curr.totalPrice,
        0
      );

      console.log(totalProductsPrice);
      console.log(totalProductsPriceAfterDiscount);

      const totalDiscount =
        totalProductsPrice - totalProductsPriceAfterDiscount;

      console.log(totalDiscount, coupon);

      const order_data = {
        total_amount: total || subtotal,
        shipping_fee: 0,
        shipping_address: {
          address_type: selectedAddress.addressType,
          address: selectedAddress.address,
          district: selectedAddress.district,
          state: selectedAddress.state,
          zip: selectedAddress.pinCode,
          phone: selectedAddress.phone,
        },
        payment_method: paymentMethod,
        total_price_with_discount: total,
        order_items: cart.items.map((item) => ({
          product: item.product._id,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          total_price: item.totalPrice - coupon || 0,
        })),
        discount: coupon + totalDiscount,
        coupon_discount: coupon,
      };

      console.log("======================================================");
      console.log("data to send ===>", order_data);

      const response = await axiosInstance.post("/api/users/place-order", {
        order_data,
      });

      console.log(response.data);
      setOrderId(response.data.order_id);
      toast.success("Order placed successfully", {
        position: "top-center",
      });
      // Placeholder for API call
      // const response = await placeOrderAPI(cart, total, paymentMethod);
      // if (response.success) {
      setIsOrderPlaced(true);
      // } else {
      //   throw new Error('Failed to place order');
      // }
    } catch (error) {
      if (error.status == 500) {
        toast.error("Please choose a payment method", {
          position: "top-center",
        });
      }
      if (error.status == 400) {
        toast.error(error.response.data.message, { position: "top-center" });
      }
      console.error("Error placing order:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {!isOrderPlaced ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {cart?.items &&
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      {
                        item.product.variants.find(
                          (v) => v.sku === item.variant
                        )?.ram
                      }
                      ,
                      {
                        item.product.variants.find(
                          (v) => v.sku === item.variant
                        )?.storage
                      }
                      ,
                      {
                        item.product.variants.find(
                          (v) => v.sku === item.variant
                        )?.color
                      }
                    </p>
                  </div>
                  <p>
                    ₹{item.totalPrice} x {item.quantity}
                  </p>
                </div>
              ))}
            <div className="border-t mt-4 pt-4">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping:</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </p>
              {coupon >= 0 && (
                <p className="flex justify-between">
                  <span>Coupon:</span>
                  <span>{coupon}</span>
                </p>
              )}
              <p className="flex justify-between font-bold mt-2">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </p>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Payment Method:</p>
              <p>{paymentMethod}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              {paymentMethod !== "Paypal" && (
                <button
                  onClick={handlePlaceOrder}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  Place Order
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order will be delivered soon.
            </p>
            <button
              onClick={() => onPlace(orderId)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
        <div className="mt-5">
          {paymentMethod === "Paypal" && (
            <PaypalCheckout
              totalAmount={subtotal}
              handlePlaceOrder={handlePlaceOrder}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
