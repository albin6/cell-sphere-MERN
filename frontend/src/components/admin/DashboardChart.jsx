"use client";

import React, { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const DashboardChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("area");
  const [viewMode, setViewMode] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellingCategories, setBestSellingCategories] = useState([]);
  const [bestSellingBrands, setBestSellingBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chartResponse, bestSellingResponse] = await Promise.all([
          fetch(`/api/admin/chart-data?viewMode=${viewMode}`),
          fetch("/api/admin/best-selling"),
        ]);

        if (!chartResponse.ok || !bestSellingResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const chartData = await chartResponse.json();
        const bestSellingData = await bestSellingResponse.json();

        setChartData(chartData.data);
        setBestSellingProducts(bestSellingData.products);
        setBestSellingCategories(bestSellingData.categories);
        setBestSellingBrands(bestSellingData.brands);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  const renderChart = () => {
    const ChartComponent = chartType === "area" ? AreaChart : BarChart;
    const DataComponent = chartType === "area" ? Area : Bar;

    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
                      <p className="text-sm font-semibold">{label}</p>
                      {payload.map((entry, index) => (
                        <p
                          key={index}
                          className="text-sm"
                          style={{ color: entry.color }}
                        >
                          {`${entry.name}: ${entry.value}`}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <DataComponent
              type="monotone"
              dataKey="sales"
              yAxisId="left"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.2}
            />
            <DataComponent
              type="monotone"
              dataKey="customers"
              yAxisId="right"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.2}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Sales and Customer Overview</h2>
          <p className="text-gray-600">Track your sales and customer growth</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="area">Area Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          <div className="space-x-2">
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-4 py-2 rounded-md ${
                viewMode === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode("yearly")}
              className={`px-4 py-2 rounded-md ${
                viewMode === "yearly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        {renderChart()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Best Selling Products</h3>
          <ul className="space-y-2">
            {bestSellingProducts.map((product) => (
              <li
                key={product._id}
                className="flex justify-between items-center"
              >
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-sm font-semibold">
                  {product.quantity_sold} units
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Best Selling Categories
          </h3>
          <ul className="space-y-2">
            {bestSellingCategories.map((category) => (
              <li
                key={category._id}
                className="flex justify-between items-center"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm font-semibold">
                  {category.totalSold} units
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Best Selling Brands</h3>
          <ul className="space-y-2">
            {bestSellingBrands.map((brand) => (
              <li key={brand._id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{brand.name}</span>
                <span className="text-sm font-semibold">
                  {brand.totalSold} units
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
