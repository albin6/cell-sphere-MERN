import React from "react";
import { ClipboardList, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function NoOrdersFoundAdmin() {
  return (
    <div className="h-96 mt-44 bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ClipboardList className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            No orders found
          </h2>
          <p className="mt-1 text-gray-500">
            There are currently no orders in the system. This could be due to
            various reasons.
          </p>
        </div>
      </main>
    </div>
  );
}
