import AsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const get_best_selling = AsyncHandler(async (req, res) => {
  console.log("in get best selling");
  const limit = 10;

  const [best_selling_products, best_selling_categories, best_selling_brands] =
    await Promise.all([
      // Best Selling Products
      Product.aggregate([
        { $match: { is_active: true } }, // Only active products
        { $sort: { quantity_sold: -1 } }, // Sort by quantity sold in descending order
        { $project: { name: 1, quantity_sold: 1 } }, // Only keep name and quantity_sold
        { $limit: limit }, // Limit to top N products
      ]),

      Product.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: "$category",
            totalSold: { $sum: { $toInt: "$quantity_sold" } }, // Convert to integer
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "categories", // Ensure the collection name matches
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: "$categoryDetails.title",
            totalSold: 1,
          },
        },
      ]),

      // Best Selling Brands
      Product.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: "$brand",
            totalSold: { $sum: { $toInt: "$quantity_sold" } }, // Convert to integer
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "brands", // Ensure the collection name matches
            localField: "_id",
            foreignField: "_id",
            as: "brandDetails",
          },
        },
        {
          $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            name: "$brandDetails.name",
            totalSold: 1,
          },
        },
      ]),
    ]);

  console.log(best_selling_products);
  console.log("=======================================");
  console.log(best_selling_categories);
  console.log("=======================================");
  console.log(best_selling_brands);

  res.json({
    success: true,
    products: best_selling_products,
    categories: best_selling_categories,
    brands: best_selling_brands,
  });
});
