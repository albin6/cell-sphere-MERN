import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import {
  Clock1Icon,
  IndianRupee,
  Menu,
  ShoppingBasket,
  UserIcon,
} from "lucide-react";
import { useDashboard } from "../../hooks/CustomHooks";
import Loading from "./Loading";
import DashboardChart from "./DashboardChart";
import BestSelling from "./BestSelling";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const closeSidebar = () => setSideBarOpen(false);

  useEffect(() => {
    console.log(data);
    setTotalUsers(data?.totalUsers);
    setTotalOrders(data?.totalOrders);
    setTotalSales(data?.totalSales);
    setPendingOrders(data?.totalPendingOrders);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex bg-gray-100">
      <div className="hidden md:flex">
        <Sidebar open={true} onClose={closeSidebar} />
      </div>

      {/* Toggle Button for Sidebar (only visible on mobile) */}
      <button
        className="flex md:hidden rounded bg-gray-800 text-white h-8 absolute w-8 justify-center items-center transition-colors top-4 left-4"
        onClick={toggleSideBar}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar for mobile (visible only when sideBarOpen is true) */}
      {sideBarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-75">
          <Sidebar open={sideBarOpen} onClose={closeSidebar} />
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Users"
              value={`${totalUsers}`}
              icon={<UserIcon />}
            />
            <StatCard
              title="Total Orders"
              value={`${totalOrders}`}
              icon={<ShoppingBasket />}
            />
            <StatCard
              title="Total Sales"
              value={`₹ ${
                totalSales ? Number(totalSales).toLocaleString() : 0
              }`}
              icon={<IndianRupee />}
            />
            <StatCard
              title="Pending Orders"
              value={`${pendingOrders || 0}`}
              icon={<Clock1Icon />}
            />
          </div>

          <DashboardChart />
          <BestSelling />
        </main>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);
