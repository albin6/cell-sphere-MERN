import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cancelOrder } from "../../../utils/order/orderCRUD";
import { useOrderDetailsMutation } from "../../../hooks/CustomHooks";
import { axiosInstance } from "../../../config/axiosInstance";
import { FileDown, Loader2 } from "lucide-react";
import FailedPayment from "../paypal-payment/FailedPayment";
import { generateRandomCode } from "../../../utils/random-code/randomCodeGenerator";

export default function OrderCard({ order, refetch }) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { mutate: cancel_order } = useOrderDetailsMutation(cancelOrder);

  const [sku, setSku] = useState(null);

  const [generatingInvoice, setGeneratingInvoice] = useState(null);

  const [isRepaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [anyRepaymentLeft, setAnyRepaymentLeft] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleCloseRapaymentModal = (isSuccess) => {
    setIsPaymentModalOpen(false);
    if (isSuccess) {
      refetch();
    }
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
    const hasEligibleItems = order?.orderItems.some(
      (item) => item?.status === "Shipped" || item?.status === "Pending"
    );
    setAnyRepaymentLeft(hasEligibleItems);
  }, [order]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    console.log("data to send cancel==>", sku, order.id);
    const data = {
      orderId: order.id,
      sku,
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
    console.log("Order cancelled:", order.id);
    setShowCancelModal(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">
            Order Placed:
          </span>
          <span className="text-sm">{order.date}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">
            Delivery By:
          </span>
          <span className="text-sm">{order.delivery_date}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Total:</span>
          <span className="text-sm">₹{order.total.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Ship To:</span>
          <span className="text-sm">{order.customerName}</span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-b">
        <p className="text-sm font-medium">
          <span className="mr-2 text-gray-600">Order #</span>
          {generateRandomCode()}
        </p>
        <button
          onClick={() => navigate(`/profile/orders/${order.id}`)}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-2 py-1 transition-colors duration-200"
        >
          View Order Details
        </button>
      </div>
      <div className="p-4 space-y-4">
        {order &&
          order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4 border-b last:border-b-0"
            >
              <div className="flex space-x-4 flex-grow">
                <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      item.image
                    }`}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 flex-grow">
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{Number(item.price).toFixed(2)}
                  </p>
                  {order &&
                    order.orderStatus === "Delivered" &&
                    order.returnEligible && (
                      <p className="text-xs text-red-500">
                        {order.returnEligible}
                      </p>
                    )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 sm:min-w-[120px]">
                <div
                  className={`text-sm font-medium px-2 py-1 ${
                    item.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.status}
                </div>
                <div className="space-x-2 flex">
                  {item.status === "Delivered" &&
                  item.return_eligible === "Eligible for return" ? (
                    <button className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200">
                      Return
                    </button>
                  ) : item.status === "Cancelled" ? (
                    <button
                      className="cursor-not-allowed w-full sm:w-auto bg-gray-300 text-gray-500 px-3 py-1 rounded opacity-50"
                      disabled
                    >
                      Cancelled
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSku(item.sku);
                        handleCancelClick();
                      }}
                      className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => generateInvoice(order.id)}
                    disabled={generatingInvoice === order.id}
                    className="px-3 py-1 text-sm border flex justify-center items-center border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    {generatingInvoice === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4 mr-2" />
                    )}
                    {generatingInvoice === order.id
                      ? "Generating..."
                      : "Invoice"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        {anyRepaymentLeft && order.paymentStatus === "Failed" && (
          <div className="w-full flex justify-end items-center">
            <div className="flex items-center h-11 mr-3">
              Payment Status:{" "}
              <span className="text-red-700">{order.paymentStatus}</span>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full sm:w-auto bg-red-500 text-white px-3 h-8 rounded hover:bg-red-600"
            >
              Retry Payment
            </button>
          </div>
        )}
      </div>

      {isRepaymentModalOpen && (
        <FailedPayment
          onClose={handleCloseRapaymentModal}
          amount={order.total}
          orderId={order.id}
        />
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full m-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="mb-6">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
