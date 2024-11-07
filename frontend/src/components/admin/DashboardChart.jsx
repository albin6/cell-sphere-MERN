import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { adminAxiosInstance } from "../../config/axiosInstance";

export default function TwoLineChart() {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({
    sales: 0,
    revenue: 0,
    customers: 0,
    orders: 0,
  });
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, [selectedYear, selectedMonth]);

  const fetchChartData = async () => {
    try {
      const response = await adminAxiosInstance.get("/api/admin/chart-data", {
        params: {
          year: selectedYear,
          month: selectedMonth !== "all" ? selectedMonth : undefined,
        },
      });
      setChartData(response.data.overview);
      setTotals(response.data.totals);
      if (availableYears.length === 0) {
        const years = [
          ...new Set(
            response.data.overview.map((item) => item.name.split("-")[0])
          ),
        ];
        setAvailableYears(years.sort((a, b) => b - a));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="w-full my-16 bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Revenue vs Customers
        </h2>
        <div className="flex space-x-4">
          <select
            className="border rounded p-2 text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {monthNames.map((month, index) => (
              <option
                key={month}
                value={(index + 1).toString().padStart(2, "0")}
              >
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="name" className="text-xs text-gray-600" />
            <YAxis className="text-xs text-gray-600" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹ {totals?.sales.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹ {totals.revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-gray-800">
            {totals.customers.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">
            {totals.orders.toLocaleString()}
          </p>
        </div>
      </div>
      {selectedMonth !== "all" && chartData.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            Monthly Overview: {monthNames[parseInt(selectedMonth) - 1]}{" "}
            {selectedYear}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="name" className="text-xs text-gray-600" />
                <YAxis className="text-xs text-gray-600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="customers" fill="#f59e0b" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
