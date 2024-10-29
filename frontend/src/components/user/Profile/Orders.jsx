import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export default function Orders({
  initialOrders = [
    { id: "1", date: "2023-05-01", total: 99.99, status: "Delivered" },
    { id: "2", date: "2023-05-15", total: 149.99, status: "Processing" },
    { id: "3", date: "2023-05-30", total: 79.99, status: "Shipped" },
  ],
}) {
  const [orders, setOrders] = useState(initialOrders);

  const cancelOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <Link
            href="/user"
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Profile
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-indigo-600">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="mt-2 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Cancel Order
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
