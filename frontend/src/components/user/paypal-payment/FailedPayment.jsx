import React from "react";
import PaypalCheckout from "./PaypalCheckout";
import { axiosInstance } from "../../../config/axiosInstance";
import { toast } from "react-toastify";
import Paypal from "./Paypal";
import { X } from "lucide-react";

function FailedPayment({ onClose, amount, orderId }) {
  const handlePayment = async (payment_status) => {
    try {
      const response = await axiosInstance.put("/api/users/re-payment", {
        payment_status,
        orderId,
      });
      toast.success(response.data.message, { position: "top-center" });
      onClose(true);
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-100 rounded w-96 p-5">
        <div className="w-full flex justify-end pr-1">
          <button onClick={() => onClose(false)}>
            <X />
          </button>
        </div>
        <div className="font-normal pl-5 mt-3">Proceed with the payment!</div>
        <div className="mx-4 py-3">
          <div className="text-center h-14 w-full text-xl text-white font-medium mb-3 bg-gray-800 rounded flex justify-center items-center">
            PAY ₹{amount}
          </div>
          <Paypal>
            <PaypalCheckout
              totalAmount={amount}
              handlePlaceOrder={handlePayment}
              onClose={onClose}
            />
          </Paypal>
        </div>
      </div>
    </div>
  );
}

export default FailedPayment;
