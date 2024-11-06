import AsyncHandler from "express-async-handler";

export const get_best_selling = AsyncHandler(async (req, res) => {
  console.log("in get best selling");

  const [best_selling_products, best_selling_categories, best_selling_brands] =
    await Promise.all([
      Order.aggregate([
        { $unwind: "$order_items" }, // Flatten the order_items array
        {
          $group: {
            _id: "$order_items.product", // Group by product ID
            totalSold: { $sum: "$order_items.quantity" }, // Sum the quantities sold
          },
        },
        {
          $lookup: {
            from: "products", // Name of the product collection
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Flatten product details
        {
          $project: {
            _id: "$productDetails._id",
            name: "$productDetails.name",
            brand: "$productDetails.brand",
            totalSold: 1,
          },
        },
        { $sort: { totalSold: -1 } }, // Sort by total sold
        { $limit: limit }, // Limit to top N
      ]),

      Order.aggregate([
        { $unwind: "$order_items" }, // Flatten the order_items array
        {
          $lookup: {
            from: "products", // Name of the product collection
            localField: "order_items.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Flatten product details
        {
          $group: {
            _id: "$productDetails.category", // Group by product category
            totalSold: { $sum: "$order_items.quantity" }, // Sum the quantities sold
          },
        },
        {
          $lookup: {
            from: "categories", // Name of the category collection
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" }, // Flatten category details
        {
          $project: {
            _id: "$categoryDetails._id",
            name: "$categoryDetails.name",
            totalSold: 1,
          },
        },
        { $sort: { totalSold: -1 } }, // Sort by total sold
        { $limit: limit }, // Limit to top N
      ]),

      Order.aggregate([
        { $unwind: "$order_items" }, // Flatten the order_items array
        {
          $lookup: {
            from: "products", // Name of the product collection
            localField: "order_items.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Flatten product details
        {
          $group: {
            _id: "$productDetails.brand", // Group by product brand
            totalSold: { $sum: "$order_items.quantity" }, // Sum the quantities sold
          },
        },
        {
          $lookup: {
            from: "brands", // Name of the brand collection
            localField: "_id",
            foreignField: "_id",
            as: "brandDetails",
          },
        },
        { $unwind: "$brandDetails" }, // Flatten brand details
        {
          $project: {
            _id: "$brandDetails._id",
            name: "$brandDetails.name",
            totalSold: 1,
          },
        },
        { $sort: { totalSold: -1 } }, // Sort by total sold
        { $limit: limit }, // Limit to top N
      ]),
    ]);

  console.log(best_selling_products);
  console.log("=======================================");
  console.log(best_selling_categories);
  console.log("=======================================");
  console.log(best_selling_brands);
});
