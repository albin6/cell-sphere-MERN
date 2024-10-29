import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Clock1Icon,
  DollarSignIcon,
  ShoppingBasket,
  UserIcon,
} from "lucide-react";
import { useDashboard } from "../../hooks/CustomHooks";

const salesData = [
  { name: "Jan", sales: 0 },
  { name: "Feb", sales: 25500 },
  { name: "Mar", sales: 35000 },
  { name: "Apr", sales: 46000 },
  { name: "May", sales: 50000 },
  { name: "Jun", sales: 60000 },
];

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    console.log(data);
    setTotalUsers(data?.totalUsers);
    setTotalOrders(data?.totalOrders);
    setTotalSales(data?.totalSales);
    setPendingOrders(data?.totalPendingOrders);
  }, [data]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
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
              value={`${Number(totalSales).toFixed(2)}`}
              icon={<DollarSignIcon />}
            />
            <StatCard
              title="Pending Orders"
              value={`${pendingOrders || 0}`}
              icon={<Clock1Icon />}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sales Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF" }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#F3F4F6",
                      border: "none",
                      borderRadius: "0.375rem",
                    }}
                    itemStyle={{ color: "#111827" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
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
