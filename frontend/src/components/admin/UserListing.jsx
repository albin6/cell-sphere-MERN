import React, { useState, useEffect, useCallback } from "react";
import fetchUsers from "../../utils/fetchUsers";
import { adminAxiosInstance } from "../../config/axiosInstance";
import AdminBlockUserModal from "./AdminBlockUserModal";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/Slices/userSlice";
import { clearCookie } from "../../utils/clearCookie/clearCookie";
import Pagination from "../user/Pagination";
import { generateRandomCode } from "../../utils/random-code/randomCodeGenerator";

export default function UserListing() {
  // ===========================================================================
  // ========================== for pagination =================================
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ===========================================================================
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const [userNameToBlock, setUserNameToBlock] = useState(null);
  const [currentUserStatus, setUserCurrentStatus] = useState(null);

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage)
      .then((data) => {
        setUsersList(data.users);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [currentPage]);

  useEffect(() => {
    setFilteredUserList(usersList);
    console.log("filtered list updated");
  }, [usersList]);

  const handleBlockUser = (userId, username, userStatus) => {
    setUserCurrentStatus(userStatus);
    setUserNameToBlock(username);
    setUserIdToBlock(userId);
    setIsModalOpen(true);
  };

  const toggleBlockStatus = async (userId) => {
    try {
      const response = await adminAxiosInstance.patch("/api/admin/users-list", {
        userId,
      });

      // Update the list of users in the state
      const updatedUserData = response.data.updated_user_data;

      if (updatedUserData.is_blocked) {
        dispatch(logoutUser());
        localStorage.removeItem("user_access_token");
        clearCookie("user_refresh_token");
      }

      setUsersList((prevUsersList) => {
        return prevUsersList.map((user) =>
          user._id === updatedUserData._id
            ? { ...user, is_blocked: updatedUserData.is_blocked }
            : user
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log("UserListing Component rendered..........");
  console.log("usersList: ", usersList);
  console.log("filteredUserList: ", filteredUserList);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Listing</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">User ID</th>
            <th className="py-3 px-6 text-left">First Name</th>
            <th className="py-3 px-6 text-left">Last Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone Number</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredUserList.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {generateRandomCode()}
              </td>
              <td className="py-3 px-6 text-left">{user.first_name}</td>
              <td className="py-3 px-6 text-left">{user.last_name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-left">{user.phone_number}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() =>
                    handleBlockUser(user._id, user.first_name, user.is_blocked)
                  }
                  className={`py-1 px-3 rounded-full text-xs font-bold ${
                    user.is_blocked
                      ? "bg-green-200 text-green-700 hover:bg-green-300"
                      : "bg-red-200 text-red-700 hover:bg-red-300"
                  }`}
                >
                  {user.is_blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUserList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
      <AdminBlockUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={toggleBlockStatus}
        userId={userIdToBlock || ""}
        username={userNameToBlock}
        currentStatus={currentUserStatus ? "Unblock" : "Block"}
      />
    </div>
  );
}
