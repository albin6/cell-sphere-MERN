import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoOrdersFound() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-2 text-lg font-medium text-gray-900">
        No orders found
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        You haven't placed any orders yet. Start shopping to see your orders
        here!
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate("/products/list")}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}
