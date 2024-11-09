import React, { useState, useEffect } from "react";
import {
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

export default function DashboardChart() {
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

      let processedData;
      if (selectedMonth === "all") {
        // Create an array with all months, initialize with empty data
        processedData = monthNames.map((month, index) => ({
          name: `${selectedYear}-${(index + 1).toString().padStart(2, "0")}`,
          sales: 0,
          customers: 0,
        }));

        // Fill in the data we have
        response.data.overview.forEach((item) => {
          const monthIndex = parseInt(item.name.split("-")[1]) - 1;
          processedData[monthIndex] = item;
        });
      } else {
        processedData = response.data.overview;
      }

      setChartData(processedData);
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
          Sales vs Customers
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => {
                const month = parseInt(value.split("-")[1]) - 1;
                return monthNames[month];
              }}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              labelFormatter={(value) => {
                const [year, month] = value.split("-");
                return `${monthNames[parseInt(month) - 1]} ${year}`;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" fill="#11100f" name="Sales" />
            <Bar
              yAxisId="right"
              dataKey="customers"
              fill="#10B981"
              name="Customers"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹ {totals.sales.toLocaleString()}
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
    </div>
  );
}
