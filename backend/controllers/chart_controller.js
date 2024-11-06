import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import SalesReport from "../models/salesModel.js";

// for getting the users count
//  GET /api/admin/users-count
export const get_dashboard_data = AsyncHandler(async (req, res) => {
  console.log("in get_user_count");

  const total_users_count = await User.countDocuments({});
  const total_orders_count = await Order.countDocuments({});
  const total_sales = await SalesReport.aggregate([
    { $group: { _id: null, sum: { $sum: "$finalAmount" } } },
  ]);

  const totalPendingOrders = await Order.aggregate([
    { $match: { "order_items.order_status": "Pending" } },
    { $count: "totalPendingOrders" },
  ]);

  console.log(totalPendingOrders);

  const dashboard_data = {
    totalUsers: total_users_count,
    totalOrders: total_orders_count,
    totalSales: total_sales[0]?.sum,
    totalPendingOrders: totalPendingOrders[0]?.totalPendingOrders,
  };

  res.json(dashboard_data);
});

// for getting data for chart
// /api/admin/chart-data
export const get_chart_data = async (req, res) => {
  try {
    const { viewMode } = req.query;
    const currentDate = new Date();
    let startDate;

    if (viewMode === "yearly") {
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        1
      );
    } else {
      // Default to monthly view
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 11,
        1
      );
    }

    const aggregationPipeline = [
      {
        $match: {
          placed_at: { $gte: startDate },
          payment_status: "Paid", // Only consider paid orders
        },
      },
      {
        $group: {
          _id:
            viewMode === "yearly"
              ? { $year: "$placed_at" }
              : { $dateToString: { format: "%Y-%m", date: "$placed_at" } },
          sales: { $sum: "$total_price_with_discount" },
          customers: { $addToSet: "$user" },
        },
      },
      {
        $project: {
          date: "$_id",
          sales: 1,
          customers: { $size: "$customers" },
        },
      },
      { $sort: { date: 1 } },
    ];

    const chartData = await Order.aggregate(aggregationPipeline);

    res.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
