import React from "react";
import Header from "../../components/user/Header";
import UserDetails from "../../components/user/Profile/UserDetails";
import Footer from "../../components/user/Footer";

function UserProfile() {
  return (
    <>
      <Header />
      <UserDetails />
      <Footer />
    </>
  );
}

export default UserProfile;
