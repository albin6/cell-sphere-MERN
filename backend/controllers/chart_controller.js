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
    totalSales: total_sales[0].sum,
    totalPendingOrders: totalPendingOrders[0]?.totalPendingOrders,
  };

  res.json(dashboard_data);
});
