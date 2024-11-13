import React, { useState } from "react";

const ReturnRequestModal = ({
  isOpen,
  onClose,
  productVariant,
  productName,
  orderId,
  handleReturnRequest,
}) => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here
    handleReturnRequest({ orderId, productVariant, reason, comments });
    console.log("Return request submitted:", { reason, comments });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Return Request</h2>
          <p className="mb-4">
            <span className="font-semibold">Product:</span> {productName}
            <br />
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for Return
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="defective">Defective product</option>
                <option value="wrong-item">Wrong item received</option>
                <option value="not-as-described">Not as described</option>
                <option value="no-longer-needed">No longer needed</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Comments
              </label>
              <textarea
                id="comments"
                value={comments}
                placeholder="Optional..."
                onChange={(e) => setComments(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
              >
                Submit Return Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
