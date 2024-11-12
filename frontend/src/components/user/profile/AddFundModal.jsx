import React, { useState } from "react";
import { X } from "lucide-react";
import { useAddWalletBalance } from "../../../hooks/CustomHooks";
import { addFunds } from "../../../utils/wallet/walletCRUD";
import RazorPay from "../razorpay-payment/RazorPay";
import PaypalCheckout from "../paypal-payment/PaypalCheckout";

export default function AddFundModal({ isOpen = false, onClose = () => {} }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { mutate: addAmount } = useAddWalletBalance(addFunds);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = (payment_status) => {
    addAmount({ amount: Number(amount), payment_status });
    setAmount("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold">
            Add Funds to Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount to Add
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          {["Paypal"].map((method, index) => (
            <div key={index} className="flex items-center mb-4">
              <>
                <input
                  type="radio"
                  id={`payment-${index}`}
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="mr-2"
                />
                <label htmlFor={`payment-${index}`}>{method}</label>{" "}
              </>
            </div>
          ))}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
          {amount && paymentMethod === "Paypal" && (
            <PaypalCheckout
              totalAmount={amount}
              handlePlaceOrder={handleSubmit}
              isWallet={true}
            />
          )}
          {amount && paymentMethod === "Razorpay" && (
            <RazorPay amount={amount} handlePlaceOrder={handleSubmit} />
          )}
        </form>
      </div>
    </div>
  );
}
