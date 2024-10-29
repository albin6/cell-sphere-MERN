import { CheckCircleIcon } from "lucide-react";

const OrderSuccessful = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order will be delivered soon.
      </p>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 text-left">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p>
          <strong>Order Number:</strong> #12345
        </p>
        <p>
          <strong>Estimated Delivery:</strong> Wed Oct 23
        </p>
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccessful;
