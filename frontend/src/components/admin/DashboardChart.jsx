import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const staticMonthlyData = [
  { month: "Jan", sales: 5000, profit: 2000, customers: 500 },
  { month: "Feb", sales: 6000, profit: 2500, customers: 550 },
  { month: "Mar", sales: 7000, profit: 3000, customers: 600 },
  { month: "Apr", sales: 8000, profit: 3500, customers: 650 },
  { month: "May", sales: 9000, profit: 4000, customers: 700 },
  { month: "Jun", sales: 10000, profit: 4500, customers: 750 },
  { month: "Jul", sales: 11000, profit: 5000, customers: 800 },
  { month: "Aug", sales: 10500, profit: 4800, customers: 780 },
  { month: "Sep", sales: 10000, profit: 4600, customers: 760 },
  { month: "Oct", sales: 9500, profit: 4400, customers: 740 },
  { month: "Nov", sales: 9000, profit: 4200, customers: 720 },
  { month: "Dec", sales: 8500, profit: 4000, customers: 700 },
];

const bestSellingProducts = [
  { name: "iPhone 13 Pro", sales: 1500 },
  { name: "Samsung Galaxy S21", sales: 1200 },
  { name: "Google Pixel 6", sales: 1000 },
  { name: "OnePlus 9 Pro", sales: 800 },
  { name: "Xiaomi Mi 11", sales: 700 },
  { name: "iPhone 12", sales: 650 },
  { name: "Samsung Galaxy A52", sales: 600 },
  { name: "Google Pixel 5a", sales: 550 },
  { name: "OnePlus Nord", sales: 500 },
  { name: "Xiaomi Redmi Note 10", sales: 450 },
];

const bestSellingCategories = [
  { name: "Smartphones", sales: 5000 },
  { name: "Accessories", sales: 3000 },
  { name: "Tablets", sales: 2000 },
  { name: "Wearables", sales: 1500 },
  { name: "Refurbished", sales: 1000 },
  { name: "Smart Home Devices", sales: 800 },
  { name: "Audio Equipment", sales: 700 },
  { name: "Laptops", sales: 600 },
  { name: "Cameras", sales: 500 },
  { name: "Gaming Consoles", sales: 400 },
];

const bestSellingBrands = [
  { name: "Apple", sales: 3000 },
  { name: "Samsung", sales: 2500 },
  { name: "Google", sales: 1800 },
  { name: "OnePlus", sales: 1500 },
  { name: "Xiaomi", sales: 1200 },
  { name: "Sony", sales: 1000 },
  { name: "LG", sales: 900 },
  { name: "Huawei", sales: 800 },
  { name: "Motorola", sales: 700 },
  { name: "Nokia", sales: 600 },
];

const generateMonthlyData = (months) => {
  return staticMonthlyData.slice(0, months);
};

const DashboardChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState(12);

  useEffect(() => {
    const data = generateMonthlyData(timeRange);
    setChartData({
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: "Sales",
          data: data.map((item) => item.sales),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Profit",
          data: data.map((item) => item.profit),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          yAxisID: "y",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Customers",
          data: data.map((item) => item.customers),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y1",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  }, [timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Sales, Profit, and Customer Overview",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Sales & Profit ($)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Customers",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Sales, Profit, and Customer Overview
          </h2>
          <div className="space-x-4">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <Chart type={chartType} options={options} data={chartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Best Selling Products
          </h2>
          <ul className="space-y-3">
            {bestSellingProducts.map((product, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-sm font-medium text-gray-600">
                  {product.name}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {product.sales} units
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Selling Categories */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Best Selling Categories
          </h2>
          <ul className="space-y-3">
            {bestSellingCategories.map((category, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-sm font-medium text-gray-600">
                  {category.name}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {category.sales} units
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Selling Brands */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Best Selling Brands
          </h2>
          <ul className="space-y-3">
            {bestSellingBrands.map((brand, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-sm font-medium text-gray-600">
                  {brand.name}
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {brand.sales} units
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
