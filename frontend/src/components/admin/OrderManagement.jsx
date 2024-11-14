"use client";

import React, { useEffect, useState } from "react";
import { useAllOrders, useAllOrdersMutation } from "../../hooks/CustomHooks";
import {
  cancelOrderAdmin,
  changeOrderStatus,
  getOrders,
  responsForReturnRequest,
} from "../../utils/order/orderCRUD";
import { toast } from "react-toastify";
import NoOrdersFoundAdmin from "./NoOrderFoundAdmin";
import OrderDetails from "../user/my-orders/OrderDetails";
import { X } from "lucide-react";
import Pagination from "../user/Pagination";
import ConfirmationModal from "./ConfirmationModal";
import { generateRandomCode } from "../../utils/random-code/randomCodeGenerator";
import ReturnRequestDetailsModal from "./ReturnRequestDetailsModal";

export default function Component() {
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [itemChoosed, setItemChoosed] = useState(null);
  const [sku, setSku] = useState(null);
  const [returnItem, setReturnItem] = useState(null);
  const [isReturnRequestDetailsModalOpen, setIsReturnRequestDetailsModalOpen] =
    useState(false);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { data, isLoading } = useAllOrders(
    getOrders,
    currentPage,
    itemsPerPage
  );
  const { mutate: cancel_order } = useAllOrdersMutation(cancelOrderAdmin);
  const { mutate: changeStatus } = useAllOrdersMutation(changeOrderStatus);
  const { mutate: respondForRequest } = useAllOrdersMutation(
    responsForReturnRequest
  );

  useEffect(() => {
    if (data) {
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 0);
    }
  }, [data]);

  const handleStatusChange = (orderId, SKU, newStatus) => {
    changeStatus(
      { orderId, status: newStatus, sku: SKU },
      {
        onSuccess: () =>
          toast.success("Order Status Updated Successfully", {
            position: "top-center",
          }),
        onError: (error) =>
          toast.error(
            error.response.data.message || "Error while changing status",
            {
              position: "top-center",
            }
          ),
      }
    );
  };

  const handleCancelProduct = () => {
    setIsConfirmationModalOpen(false);
    cancel_order(
      { orderId, sku },
      {
        onSuccess: () =>
          toast.success("Product Cancelled Successfully", {
            position: "top-center",
          }),
        onError: () =>
          toast.error("Failed to cancel product. Please try again.", {
            position: "top-center",
          }),
      }
    );
  };

  const handleReturnRequest = (isApproved, productVariant) => {
    setIsReturnRequestDetailsModalOpen(false);
    respondForRequest(
      { isApproved, productVariant, orderId },
      {
        onSuccess: () => {
          if (isApproved) {
            return toast.success("Return request approved", {
              position: "top-center",
            });
          } else {
            return toast.error("Return request rejected", {
              position: "top-center",
            });
          }
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (orders && !orders.length) {
    return <NoOrdersFoundAdmin />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="border-b">
                  <td className="p-2">{generateRandomCode()}</td>
                  <td className="p-2">{order.user_full_name}</td>
                  <td className="p-2">
                    <ul className="space-y-4">
                      {order.order_items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="space-y-2">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              SKU: {item.sku}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: {item.order_status}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <div className="w-full sm:w-48">
                                <label
                                  htmlFor={`status-select-${order._id}`}
                                  className="sr-only"
                                >
                                  Change order status
                                </label>
                                <select
                                  id={`status-select-${order._id}`}
                                  value={item.order_status}
                                  disabled={
                                    item.order_status === "Cancelled" ||
                                    item.order_status === "Delivered" ||
                                    item.order_status === "Returned"
                                  }
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order._id,
                                      item.sku,
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
                                >
                                  <option value="" disabled>
                                    Select new status
                                  </option>
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                              {item.order_status === "Returned" ? (
                                <button
                                  className="bg-red-600 hover:bg-red-500 opacity-55 text-white px-3 py-1 rounded text-sm"
                                  disabled
                                >
                                  Returned
                                </button>
                              ) : item.order_status === "Cancelled" ? (
                                <button
                                  className="bg-red-600 hover:bg-red-500 opacity-55 text-white px-3 py-1 rounded text-sm"
                                  disabled
                                >
                                  Cancelled
                                </button>
                              ) : item.order_status === "Delivered" ? (
                                <button
                                  className="bg-red-600 hover:bg-red-500 opacity-55 text-white px-3 py-1 rounded text-sm"
                                  disabled
                                >
                                  Delivered
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setIsConfirmationModalOpen(true);
                                    setOrderId(order._id);
                                    setSku(item.sku);
                                  }}
                                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                                >
                                  Cancel Product
                                </button>
                              )}
                              {item.return_request?.is_requested && (
                                <button
                                  className={`bg-gray-800 text-white px-2 py-1 rounded text-sm ${
                                    item.return_request?.is_response_send &&
                                    "opacity-50"
                                  }`}
                                  disabled={
                                    item.return_request?.is_response_send
                                  }
                                  onClick={() => {
                                    setOrderId(order._id);
                                    setReturnItem(item);
                                    setItemChoosed(order);
                                    setIsReturnRequestDetailsModalOpen(true);
                                  }}
                                >
                                  {item.return_request?.is_response_send
                                    ? "Response Already Sent"
                                    : "View Return Request"}
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    {new Date(order.placed_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    ₹
                    {order.order_items
                      .reduce((total, item) => total + item.total_price, 0)
                      .toFixed(2)}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setItemChoosed(order);
                        setSelectedOrderId(order._id);
                        setIsOrderDetailsModalOpen(true);
                      }}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Order Details
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleCancelProduct}
      />
      {isOrderDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setIsOrderDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
              <OrderDetails orderId={selectedOrderId} />
            </div>
          </div>
        </div>
      )}
      <ReturnRequestDetailsModal
        isOpen={isReturnRequestDetailsModalOpen}
        onClose={() => setIsReturnRequestDetailsModalOpen(false)}
        order={itemChoosed}
        returnItem={returnItem}
        handleReturnRequest={handleReturnRequest}
      />
    </div>
  );
}
