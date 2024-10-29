import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import BrandListing from "../../components/user/BrandListing";
import { SearchContextProvider } from "../../context/Search";

function BrandListingPage() {
  return (
    <>
      <SearchContextProvider>
        <Header />
        <BrandListing />
      </SearchContextProvider>
      <Footer />
    </>
  );
}

export default BrandListingPage;
