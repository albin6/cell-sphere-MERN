import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import ProductListing from "../../components/user/ProductListing";
import { SearchContextProvider } from "../../context/Search";

function ProductListingPage() {
  return (
    <>
      <SearchContextProvider>
        <Header />
        <ProductListing />
      </SearchContextProvider>
      <Footer />
    </>
  );
}

export default ProductListingPage;
