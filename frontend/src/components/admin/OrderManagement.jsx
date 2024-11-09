import React, { useEffect, useState } from "react";
import OrderCancellation from "./OrderCancellation";
import SelectStatus from "./SelectStatus";
import { useAllOrders, useAllOrdersMutation } from "../../hooks/CustomHooks";
import {
  cancelOrderAdmin,
  changeOrderStatus,
  getOrders,
} from "../../utils/order/orderCRUD";
import toast from "react-hot-toast";
import NoOrdersFoundAdmin from "./NoOrderFoundAdmin";
import OrderDetails from "../user/my-orders/OrderDetails";
import { Button } from "../../components/ui/ui-components";
import { X } from "lucide-react";
import Pagination from "../user/Pagination";
import ConfirmationModal from "./ConfirmationModal";
import { generateRandomCode } from "../../utils/random-code/randomCodeGenerator";

export default function Component() {
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [sku, setSku] = useState(null);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { data, isLoading } = useAllOrders(
    getOrders,
    currentPage,
    itemsPerPage
  );
  const { mutate: cancel_order } = useAllOrdersMutation(cancelOrderAdmin);
  const { mutate: changeStatus } = useAllOrdersMutation(changeOrderStatus);

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
        onError: () =>
          toast.error("Error on changing order status", {
            position: "top-center",
          }),
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
          <thead className="bg-grayhandleStatusChange-100">
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
            {orders.map((order, index) => (
              <tr key={order._id} className="border-b">
                <td className="p-2">{generateRandomCode()}</td>
                <td className="p-2">{order.user_full_name}</td>
                <td className="p-2">
                  <ul className="space-y-4">
                    {order.order_items.map((item, itemIndex) => (
                      <li key={itemIndex} className="bg-gray-50 p-3 rounded-lg">
                        <div className="space-y-2">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            SKU: {item.sku}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {item.order_status}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className="w-48">
                              <label
                                htmlFor={`status-select-${orderId}`}
                                className="sr-only"
                              >
                                Change order status
                              </label>
                              <select
                                id={`status-select-${order._id}`}
                                value={item.order_status}
                                disabled={
                                  item.order_status === "Cancelled" ||
                                  item.order_status === "Delivered"
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

                            {item.order_status === "Cancelled" ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                className={
                                  "bg-red-600 hover:bg-red-500 opacity-55 text-white"
                                }
                                disabled={true}
                              >
                                Cancelled
                              </Button>
                            ) : item.order_status === "Delivered" ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                className={
                                  "bg-red-600 hover:bg-red-500 opacity-55 text-white"
                                }
                                disabled={true}
                              >
                                Delivered
                              </Button>
                            ) : (
                              <Button
                                onClick={() => {
                                  setIsConfirmationModalOpen(true);
                                  setOrderId(order._id);
                                  setSku(item.sku);
                                }}
                                variant="destructive"
                                size="sm"
                                className={
                                  "bg-red-600 hover:bg-red-500 text-white"
                                }
                              >
                                Cancel Product
                              </Button>
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
                  <Button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      setIsOrderDetailsModalOpen(true);
                    }}
                    variant="secondary"
                    size="sm"
                    className={"bg-gray-800 hover:bg-gray-700 text-white"}
                  >
                    Order Details
                  </Button>
                </td>
              </tr>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOrderDetailsModalOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
              <OrderDetails orderId={selectedOrderId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
