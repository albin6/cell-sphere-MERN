import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, IconButton, NavLink } from "../ui/ui-components";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/Slices/userSlice";
import { axiosInstance } from "../../config/axiosInstance";
import { searchContext } from "../../context/Search";

function Header() {
  const location = useLocation();
  const { searchTerm, handleSearchTermChange } = useContext(searchContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (event) => {
    handleSearchTermChange(event.target.value);
  };

  const handleLogout = async (e) => {
    console.log("Logout clicked");
    setIsUserMenuOpen(false);
    try {
      await axiosInstance.post("/api/users/logout");
      localStorage.removeItem("user_access_token");
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Logo
        </div>

        <nav className="hidden md:flex space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative">
            {(location.pathname === "/products/list" ||
              location.pathname.match(
                /^\/products\/categories\/[a-fA-F0-9]{24}$/
              ) ||
              location.pathname.match(
                /^\/products\/brands\/[a-fA-F0-9]{24}$/
              )) && (
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full md:w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
            )}
          </div>

          <IconButton
            icon={<Heart className="h-6 w-6" />}
            label="Wishlist"
            onClick={() => navigate("/wishlist")}
          />

          <IconButton
            icon={<ShoppingCart className="h-6 w-6" />}
            label="Cart"
            onClick={() => navigate("/cart")}
          />

          {user ? (
            <div className="relative">
              <IconButton
                icon={<User className="h-6 w-6" />}
                label="User"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              />
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log("My Account clicked");
                      navigate("/profile");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Account
                  </Button>
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/wishlist");
                      console.log("My Wishlist clicked");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Wishlist
                  </Button>
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log("My Cart clicked");
                      navigate("/cart");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Cart
                  </Button>
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                className=" text-white bg-gray-800 hover:bg-gray-700 focus:outline-none font-semibold py-2 px-4 rounded transition duration-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className=" text-white bg-gray-800 hover:bg-gray-700 focus:outline-none font-semibold py-2 px-4 rounded transition duration-300"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
