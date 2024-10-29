import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import UserListing from "../../components/admin/UserListing";

function UsersList() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="container mx-auto p-4">
          <UserListing />
        </main>
      </div>
    </div>
  );
}

export default UsersList;
