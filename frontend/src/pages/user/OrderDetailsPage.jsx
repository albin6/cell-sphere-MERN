import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import OrderDetails from "../../components/user/my-orders/OrderDetails";

function OrderDetailsPage() {
  return (
    <>
      <Header />
      <OrderDetails />
      <Footer />
    </>
  );
}

export default OrderDetailsPage;
