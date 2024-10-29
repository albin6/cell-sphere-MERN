import React, { useState } from "react";
import {
  PayPalButtons,
  FUNDING,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { inrToUsd } from "./CurrencyConverter";

const PaypalCheckout = ({ totalAmount, handlePlaceOrder, onClose }) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  const onCreateOrder = async (data, actions) => {
    const totalAmountInUSD = await inrToUsd(totalAmount); // Ensure conversion completes
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalAmountInUSD.toString(),
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      const name = details.payer.name.given_name;
      console.log(actions);
      handlePlaceOrder();
      setIsOrderPlaced(true);
      onClose;
      return;
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <p>LOADING...</p>
      ) : (
        <>
          {!isOrderPlaced && (
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => onCreateOrder(data, actions)}
              onApprove={(data, actions) => onApproveOrder(data, actions)}
              fundingSource={FUNDING.PAYPAL}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PaypalCheckout;
