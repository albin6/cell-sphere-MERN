import React, { createContext, useState } from "react";
import Header from "../../components/user/Header";
import Cart from "../../components/user/cart/Cart";
import Footer from "../../components/user/Footer";

export const stockContext = createContext([]);

function StockContextProvider({ children }) {
  const [stock, setStock] = useState([]);

  function handleStockChange(newStock) {
    console.log('stock change => ', newStock)
    setStock(newStock);
  }

  return (
    <stockContext.Provider value={{ stock, handleStockChange }}>
      {children}
    </stockContext.Provider>
  );
}

function CartPage() {
  return (
    <>
      <Header />
      <StockContextProvider>
        <Cart />
      </StockContextProvider>
      <Footer />
    </>
  );
}

export default CartPage;
