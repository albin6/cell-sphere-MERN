import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CancelOrderModal from "./CancelOrderModal";
import { toast } from "react-toastify";
import {
  useOrderDetails,
  useOrderDetailsMutation,
} from "../../../hooks/CustomHooks";
import {
  cancelOrder,
  getOrderDetails,
  requestForReturningProduct,
} from "../../../utils/order/orderCRUD";
import { FileDown, Loader2 } from "lucide-react";
import { axiosInstance } from "../../../config/axiosInstance";
import FailedPayment from "../paypal-payment/FailedPayment";
import { generateRandomCode } from "../../../utils/random-code/randomCodeGenerator";
import ReturnRequestModal from "./ReturnRequestModal";

const OrderDetails = ({ orderId: propsOrderId }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin/orders";
  const naviagate = useNavigate();
  const { orderId: paramsOrderId } = useParams();

  const orderId = propsOrderId || paramsOrderId;

  const [sku, setSku] = useState(null);

  const { data: order_data, refetch } = useOrderDetails(
    getOrderDetails(orderId)
  );
  const { mutate: cancel_order } = useOrderDetailsMutation(cancelOrder);
  const { mutate: returnRequest } = useOrderDetailsMutation(
    requestForReturningProduct
  );

  const [userName, setUserName] = useState("");
  const [order, setOrder] = useState(null);
  const [generatingInvoice, setGeneratingInvoice] = useState(null);

  const [productNameToReturn, setProductNameToReturn] = useState("");
  const [productVariantToReturn, setProductVariantToReturn] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [anyOrderLeft, setAnyOrderLeft] = useState(null);
  const [isRepaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleCloseRapaymentModal = (isSuccess) => {
    setIsPaymentModalOpen(false);
    if (isSuccess) {
      refetch();
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmCancel = () => {
    console.log("data to send cancel==>", sku, orderId);
    const data = {
      sku,
      orderId,
    };
    cancel_order(data, {
      onSuccess: () =>
        toast.success("Order Cancelled Successfully", {
          position: "top-center",
        }),
      onError: () =>
        toast.error("Failed to cancel order. Please try again.", {
          position: "top-center",
        }),
    });
    // Logic to cancel the order
    console.log("Order cancelled");
    setIsModalOpen(false);
  };

  const generateInvoice = async (orderId) => {
    console.log(orderId);
    setGeneratingInvoice(orderId);
    try {
      const response = await axiosInstance.get(
        `/api/users/orders/${orderId}/invoice`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(
        {
          title: "Success",
          description: "Invoice generated successfully.",
        },
        { position: "top-center" }
      );
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error(
        {
          title: "Error",
          description: "Failed to generate invoice. Please try again.",
          variant: "destructive",
        },
        { position: "top-center" }
      );
    }
    setGeneratingInvoice(null);
  };

  useEffect(() => {
    if (order_data) {
      console.log(order_data);
      setUserName(order_data.customerName);
      setOrder(order_data);
      setOrderDetails({
        itemTotal: order_data.orders.order_items.reduce(
          (acc, curr) => acc + curr.total_price,
          0
        ),
        itemtotalAfterDiscount: order_data.total,
        totalDiscountAmount: order_data.orders.order_items.reduce(
          (acc, curr) => acc + (curr.price * curr.discount) / 100,
          0
        ),
        totalDiscount: order_data.orders.coupon_discount,
        orderStatus: order_data.orders.order_status,
      });
    }
  }, [order_data]);

  useEffect(() => {
    const hasEligibleItems =
      order?.orders?.order_items &&
      order.orders.order_items.some(
        (item) =>
          item.order_status === "Shipped" || item.order_status === "Pending"
      );
    setAnyOrderLeft(hasEligibleItems);
  }, [order]);

  useEffect(() => console.log(anyOrderLeft), [anyOrderLeft]);

  if (!order) {
    return <h4>Loading....</h4>;
  }

  return (
    <div className="container w-2/3 mx-auto py-8">
      {paramsOrderId && (
        <>
          <nav className="text-sm mb-4">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link to={"/"} className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link
                  to={"/profile"}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Account
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li onClick={() => naviagate(-1)} className="flex items-center">
                <Link className="text-gray-500 hover:text-gray-700">
                  My Orders
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-700">Order Details</span>
              </li>
            </ol>
          </nav>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Order Details</h1>
            {userName && (
              <p className="text-sm text-gray-600">
                Welcome!{" "}
                <span className="text-gray-800 text-base font-medium">
                  {userName}
                </span>
              </p>
            )}
          </div>
        </>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <p className="text-gray-600 text-sm mb-2 sm:mb-0">
              Order# {generateRandomCode()} | Delivery By{" "}
              {order && order.deliveryBy}
            </p>

            <button
              onClick={() => generateInvoice(orderId)}
              disabled={generatingInvoice === orderId}
              className="px-3 py-1 text-sm border flex justify-center items-center border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              {generatingInvoice === orderId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              {generatingInvoice === orderId ? "Generating..." : "Invoice"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>

              <p className="text-sm">{order.customerName}</p>
              <p className="text-sm">{order.orders.shipping_address.address}</p>
              <p className="text-sm">
                {order.orders.shipping_address.district},{" "}
                {order.orders.shipping_address.state}
              </p>
              <p className="text-sm">
                Pin Code - {order.orders.shipping_address.zip}
              </p>
              <p className="text-sm">
                Contact Number - {order.orders.shipping_address.phone}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="text-sm">{order.orders.payment_method}</p>
              <h3 className="font-semibold mb-2">Payment Status</h3>
              <p
                className={`text-sm ${
                  order.orders.payment_status === "Failed"
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {order.orders.payment_status}
              </p>
              {!isAdminRoute &&
                anyOrderLeft &&
                order.orders.payment_status === "Failed" && (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full sm:w-auto bg-red-500 text-white px-3 mt-5 py-1 rounded hover:bg-red-600"
                  >
                    Retry Payment
                  </button>
                )}
            </div>
            <div className="gap-3">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <p>Items Total</p>

                <p>
                  ₹
                  {(
                    +Number(orderDetails.itemtotalAfterDiscount) +
                    +Number(orderDetails.totalDiscountAmount) +
                    +Number(order.orders.coupon_discount)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Coupon</p>
                <p>₹{Number(order.orders.coupon_discount).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping Charge</p>
                <p>₹{order.orders.shipping_fee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Total Discount:</p>
                <p>
                  ₹
                  {+Number(orderDetails.totalDiscountAmount) +
                    +Number(order.orders.coupon_discount).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <p>Total</p>
                <p>₹{Number(orderDetails.itemtotalAfterDiscount).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold text-sm mt-2">
                <p>Grand Total</p>
                <p>₹{Number(orderDetails.itemtotalAfterDiscount).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            {order &&
              order?.orders?.order_items.map((o) => (
                <div
                  key={o._id}
                  className="flex flex-col sm:flex-row items-start gap-4 mb-4"
                >
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      o.product.variants[0].images[0]
                    }`}
                    alt="HELLO ZONE Back Cover Case"
                    className="w-[80px] h-[80px] rounded-md object-cover"
                  />
                  <div className="flex-grow flex justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">
                        {o.product.name} ( {o.product.variants[0].ram},{" "}
                        {o.product.variants[0].storage},{" "}
                        {o.product.variants[0].color})
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Price: ₹{Number(o.total_price).toFixed(2)}{" "}
                        <span className="text-sm text-green-800 font-semibold">
                          <strike className=" text-red-800">₹{o.price}</strike>{" "}
                          {(
                            ((o.price - o.total_price) / o.price) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </p>
                    </div>
                    <div className=" ">
                      <div>
                        <p className="text-green-600 font-semibold mb-2 sm:mb-0">
                          Order Status : {o.order_status}
                        </p>
                      </div>
                      <div className="space-y-2 flex justify-end sm:space-y-0 sm:space-x-2">
                        {o.order_status === "Cancelled" ? (
                          <button
                            className="cursor-not-allowed w-full sm:w-auto bg-red-500 text-white px-3 mt-5 py-1 rounded hover:bg-red-600"
                            disabled
                          >
                            Cancelled
                          </button>
                        ) : o.order_status === "Delivered" ? (
                          <button
                            onClick={() => {
                              setProductNameToReturn(o.product.name);
                              setProductVariantToReturn(o.variant);
                              setIsRequestModalOpen(true);
                            }}
                            className={`w-full sm:w-auto ${
                              o.return_request?.is_requested
                                ? "opacity-50"
                                : "opacity-50"
                            } bg-red-500 text-white px-3 mt-5 py-1 rounded hover:bg-red-600`}
                            disabled={o.return_request?.is_requested}
                          >
                            {o.return_request?.is_requested
                              ? "Return request send"
                              : "Return"}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSku(o.variant);
                              handleOpenModal();
                            }}
                            className="w-full sm:w-auto bg-red-500 text-white px-3 mt-5 py-1 rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            <ReturnRequestModal
              isOpen={isRequestModalOpen}
              onClose={() => setIsRequestModalOpen(false)}
              productName={productNameToReturn}
              productVariant={productVariantToReturn}
              orderId={orderId}
              handleReturnRequest={returnRequest}
            />

            <CancelOrderModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirmCancel}
              orderNumber={orderId}
            />

            {isRepaymentModalOpen && (
              <FailedPayment
                onClose={handleCloseRapaymentModal}
                amount={orderDetails.itemtotalAfterDiscount}
                orderId={orderId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
