import React from "react";
import { generateRandomCode } from "../../utils/random-code/randomCodeGenerator";

const ReturnRequestDetailsModal = ({
  isOpen,
  onClose,
  request,
  returnItem,
  handleReturnRequest,
}) => {
  if (!isOpen) return null;
  console.log(request);
  console.log(returnItem);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Return Request Details</h2>
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-semibold">Product:</span>{" "}
              {returnItem?.product_name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Order ID:</span>{" "}
              {generateRandomCode()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Request ID:</span>{" "}
              {generateRandomCode()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Customer:</span>{" "}
              {request?.user_full_name}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Reason for Return</h3>
            <p className="px-3 py-2 bg-gray-100 rounded-md">
              {returnItem.return_request.reason}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Additional Comments</h3>
            <p className="px-3 py-2 bg-gray-100 rounded-md">
              {returnItem.return_request.comment ||
                "No additional comments provided."}
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800"
            >
              Close
            </button>
            <button
              onClick={() => handleReturnRequest(false, returnItem.sku)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Reject
            </button>
            <button
              onClick={() => handleReturnRequest(true, returnItem.sku)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestDetailsModal;
