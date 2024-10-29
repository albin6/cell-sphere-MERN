import React from "react";
import Header from "../../components/user/Header";
import Orders from "../../components/user/my-orders/Orders";
import Footer from "../../components/user/Footer";

function OrdersPage() {
  return (
    <>
      <Header />
      <Orders />
      <Footer />
    </>
  );
}

export default OrdersPage;
