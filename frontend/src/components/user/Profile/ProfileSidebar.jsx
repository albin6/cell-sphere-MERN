import React from "react";
import { Button } from "../../ui/ui-components";

import { Link } from "react-router-dom";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-full md:w-64 bg-gray-50 p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-4xl text-gray-600">CN</span>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-center mb-6">Customer Name</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === "profile"
                  ? "text-gray-600 bg-blue-100"
                  : "hover:bg-gray-200"
              }`}
            >
              My Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === "addresses"
                  ? "text-gray-600 bg-blue-100"
                  : "hover:bg-gray-200"
              }`}
            >
              Address Book
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === "orders"
                  ? "text-gray-600 bg-blue-100"
                  : "hover:bg-gray-200"
              }`}
            >
              My Orders
            </button>
          </li>
          <li>
            <Link
              to={"/wishlist"}
              className="block py-2 px-4 hover:bg-gray-200 rounded"
            >
              My Wishlist
            </Link>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === "wallet"
                  ? "text-gray-600 bg-blue-100"
                  : "hover:bg-gray-200"
              }`}
            >
              Wallet
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("coupon")}
              className={`w-full text-left py-2 px-4 rounded ${
                activeTab === "coupon"
                  ? "text-gray-600 bg-blue-100"
                  : "hover:bg-gray-200"
              }`}
            >
              Coupons
            </button>
          </li>
        </ul>
      </nav>

      {/* <div className="mt-8 space-y-2">
        <Button variant="outline" className="w-full">
          Deactivate Account
        </Button>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>

      </div> */}
    </aside>
  );
};

export default ProfileSidebar;
