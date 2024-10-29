import AsyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";

// for adding new coupon
export const add_new_coupon = AsyncHandler(async (req, res) => {
  console.log("in add_new_coupon");

  const {
    code,
    description,
    discount_type,
    discount_value,
    min_purchase_amount,
    max_discount_amount,
    expiration_date,
    usage_limit,
    eligible_categories,
  } = req.body;

  if (
    !code ||
    !description ||
    !discount_type ||
    !discount_value ||
    !min_purchase_amount ||
    !max_discount_amount ||
    !expiration_date ||
    !usage_limit ||
    !eligible_categories
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  // check if coupon code already exists
  const existing_coupon = await Coupon.findOne({
    code: { $regex: new RegExp(code, "i") },
  });

  if (existing_coupon) {
    return res.status(400).json({ message: "Coupon code already exists" });
  }

  const category_data = await Category.findOne({
    _id: { $in: eligible_categories },
  });

  if (!category_data) {
    return res.status(400).json({ message: "Invalid category" });
  }

  // create new coupon
  const new_coupon = await Coupon.create({
    code,
    description,
    discount_type,
    discount_value,
    min_purchase_amount,
    max_discount_amount,
    expiration_date,
    usage_limit,
    eligible_categories,
  });

  res.status(201).json({ success: true, data: new_coupon });
});

// for getting coupons in admin
// GET /api/admin/coupons
export const get_coupons = AsyncHandler(async (req, res) => {
  console.log("in get_coupons");

  const { currentPage = 1, itemsPerPage = 10 } = req.query;

  const page = parseInt(currentPage, 10);
  const limit = parseInt(itemsPerPage, 10);
  // Convert page and limit to integers

  const skip = (page - 1) * limit;

  // Calculate total number of coupons
  const totalCoupons = await Coupon.countDocuments();

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCoupons / limit);

  // Fetch the coupons with pagination
  const coupons = await Coupon.find({}).skip(skip).limit(limit).exec();

  res.status(200).json({
    coupons,
    totalPages,
    currentPage: page,
    itemsPerPage: limit,
  });
});

// for getting coupons by user
// GET /api/users/coupons
export const get_coupons_user = AsyncHandler(async (req, res) => {
  console.log("in get_coupons");

  const { currentPage = 1, itemsPerPage = 10 } = req.query;

  const page = parseInt(currentPage, 10);
  const limit = parseInt(itemsPerPage, 10);
  // Convert page and limit to integers

  const skip = (page - 1) * limit;

  // Calculate total number of coupons
  const totalCoupons = await Coupon.countDocuments({ is_active: true });

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCoupons / limit);

  // Fetch the coupons with pagination
  const coupons = await Coupon.find({ is_active: true })
    .skip(skip)
    .limit(limit)
    .exec();

  res.status(200).json({
    coupons,
    totalPages,
    currentPage: page,
    itemsPerPage: limit,
  });
});

// for updating coupon status
export const update_coupon_status = AsyncHandler(async (req, res) => {
  console.log("in update_coupon_status");

  const { couponId } = req.body;

  if (!couponId) {
    console.log("request is invalid");
    return res.status(400).json({ message: "Invalid request data" });
  }

  const coupon_data = await Coupon.findById(couponId);

  if (!coupon_data) {
    console.log("coupon not found");
    return res.status(404).json({ message: "Coupon not found" });
  }

  coupon_data.is_active = !coupon_data.is_active;

  await coupon_data.save();

  res.status(200).json({ success: true, data: coupon_data });
});

// for deleting coupon
export const delete_coupon = AsyncHandler(async (req, res) => {
  console.log("In delete_coupon API");

  const { couponId } = req.body;

  if (!couponId) {
    console.log("Invalid request: Missing couponId");
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const coupon_data = await Coupon.deleteOne({ _id: couponId });

    if (coupon_data.deletedCount === 0) {
      console.log("Coupon not found with ID:", couponId);
      return res.status(404).json({ message: "Coupon not found" });
    }

    console.log("Coupon deleted successfully:", couponId);
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res
      .status(500)
      .json({ message: "Server error occurred while deleting coupon" });
  }
});

// for applying coupon
export const apply_coupon = AsyncHandler(async (req, res) => {
  console.log("In apply_coupon");

  const items = req.body; // Array of items
  const { code } = items[0]; // Coupon code is the same for all items

  // Fetch the coupon by code
  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  if (!coupon.is_active) {
    return res.status(400).json({ message: "Coupon is not active" });
  }

  // Check if the coupon has expired
  const currentDate = new Date();
  if (coupon.expiration_date < currentDate) {
    return res.status(400).json({ message: "Coupon has expired" });
  }

  // Prepare an array to store responses for each item
  const response = [];

  for (const item of items) {
    const { id, amount } = item;

    // Check if the product category is eligible for the coupon
    const isCategoryEligible = coupon.eligible_categories.some(
      (categoryId) => categoryId.toString() === id
    );

    if (!isCategoryEligible) {
      response.push({
        id,
        message: "This product category is not eligible for the coupon",
        discountAmount: 0,
        total_after_discount: amount,
      });
      continue; // Skip further checks for this item
    }

    // Check if minimum purchase amount is met
    if (coupon.min_purchase_amount > amount) {
      response.push({
        id,
        message: "Coupon minimum purchase amount not met",
        discountAmount: 0,
        total_after_discount: amount,
      });
      continue;
    }

    // Check if the user has already applied the coupon
    const appliedUser = coupon.users_applied.find(
      (entry) => entry.user.toString() === req.user.id
    );

    if (appliedUser && appliedUser.used_count >= coupon.usage_limit) {
      response.push({
        id,
        message: "Coupon usage limit reached for this user",
        discountAmount: 0,
        total_after_discount: amount,
      });
      continue;
    }

    // Calculate discount
    let discountAmount;
    if (coupon.discount_type === "percentage") {
      discountAmount = Math.ceil((amount * coupon.discount_value) / 100);
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    }

    const total_after_discount = amount - discountAmount;

    // Update user's usage count if applicable
    if (appliedUser) {
      await Coupon.updateOne(
        { code, "users_applied.user": req.user.id },
        { $inc: { "users_applied.$.used_count": 1 } }
      );
    } else {
      await Coupon.updateOne(
        { code },
        {
          $push: {
            users_applied: {
              user: req.user.id,
              used_count: 1,
            },
          },
        }
      );
    }

    // Add item details to response array
    response.push({
      id,
      message: "Coupon applied successfully",
      original_amount: amount,
      discountAmount,
      total_after_discount,
    });
  }

  // Send the aggregated response
  res.status(200).json(response);
});
