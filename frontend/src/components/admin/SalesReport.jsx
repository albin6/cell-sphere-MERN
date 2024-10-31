import React, { useState, useEffect } from "react";
import { Calendar, Download, FileSpreadsheet } from "lucide-react"; // Replace with actual icons
import { adminAxiosInstance } from "../../config/axiosInstance";
import { saveAs } from "file-saver"; // For file saving

const SalesReport = () => {
  const [selectedRange, setSelectedRange] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    fetchSalesData();
  }, [selectedRange, startDate, endDate]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    setStartDate("");
    setEndDate("");
  };

  const handleCustomDateChange = (e) => {
    if (e.target.name === "startDate") setStartDate(e.target.value);
    else setEndDate(e.target.value);
  };

  const fetchSalesData = async () => {
    try {
      console.log("Request Params:", {
        period: selectedRange,
        startDate: selectedRange === "custom" ? startDate : undefined,
        endDate: selectedRange === "custom" ? endDate : undefined,
      });
      const response = await adminAxiosInstance.get("/api/admin/sales-report", {
        params: {
          period: selectedRange,
          startDate: selectedRange === "custom" ? startDate : undefined,
          endDate: selectedRange === "custom" ? endDate : undefined,
        },
      });
      console.log(response.data);
      setTotalDiscount(
        response.data.reports.reduce(
          (acc, curr) =>
            acc +
            curr.product.reduce(
              (ac, cur) => ac + cur.discount + cur.couponDeduction,
              0
            ),
          0
        ),
        0
      );
      setSalesData(response.data.reports);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const downloadPDF = () => {
    adminAxiosInstance
      .get("/api/admin/download-report/pdf", {
        params: {
          period: selectedRange,
          startDate: selectedRange === "custom" ? startDate : undefined,
          endDate: selectedRange === "custom" ? endDate : undefined,
        },
        responseType: "blob",
      })
      .then((response) => {
        // Save as PDF file with specific MIME type
        const blob = new Blob([response.data], { type: "application/pdf" });
        saveAs(blob, "SalesReport.pdf");
      })
      .catch((error) => console.error("PDF download error:", error));
  };

  const downloadExcel = () => {
    adminAxiosInstance
      .get("/api/admin/download-report/excel", {
        params: {
          period: selectedRange,
          startDate: selectedRange === "custom" ? startDate : undefined,
          endDate: selectedRange === "custom" ? endDate : undefined,
        },
        responseType: "blob",
      })
      .then((response) => {
        // Save as Excel file with specific MIME type
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "SalesReport.xlsx");
      })
      .catch((error) => console.error("Excel download error:", error));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Sales Report</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Report Settings
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          {["daily", "weekly", "yearly", "custom"].map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedRange === range
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {selectedRange === "custom" && (
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Calendar className="mr-2 text-gray-500" />
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleCustomDateChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="flex items-center">
              <Calendar className="mr-2 text-gray-500" />
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleCustomDateChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Sales Report -{" "}
          {selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)}
        </h2>
        {selectedRange === "custom" && (
          <p className="text-sm text-gray-500 mb-4">
            From {startDate} to {endDate}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Payment Method</th>
                <th className="border p-2 text-left">Products</th>
                <th className="border p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesData &&
                salesData.map((sale, index) => (
                  <tr
                    key={sale._id}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="border p-2">
                      {sale.customer.first_name + " " + sale.customer.last_name}
                    </td>
                    <td className="border p-2">
                      {new Date(sale.orderDate).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{sale.paymentMethod}</td>
                    <td className="border p-2">{sale.product.length}</td>
                    <td className="border p-2">
                      ₹{sale.finalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td className="border p-2">Total</td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2">
                  ₹
                  {salesData
                    .reduce((sum, sale) => sum + sale.finalAmount, 0)
                    .toFixed(2)}
                </td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td className="border p-2">Total Discount</td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2">
                  ₹{Number(totalDiscount).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={downloadPDF}
          className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Download className="mr-2" />
          Download as PDF
        </button>
        <button
          onClick={downloadExcel}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FileSpreadsheet className="mr-2" />
          Download as Excel
        </button>
      </div>
    </div>
  );
};

export default SalesReport;
