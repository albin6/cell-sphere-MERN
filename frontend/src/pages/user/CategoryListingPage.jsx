import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import CategoryListing from "../../components/user/CategoryListing";
import { SearchContextProvider } from "../../context/Search";

function CategoryListingPage() {
  return (
    <>
      <SearchContextProvider>
        <Header />
        <CategoryListing />
      </SearchContextProvider>
      <Footer />
    </>
  );
}

export default CategoryListingPage;
