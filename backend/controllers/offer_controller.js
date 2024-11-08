import AsyncHandler from "express-async-handler";
import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";

// @desc for getting all offers
// GET /api/admin/offers
export const get_all_offers = AsyncHandler(async (req, res) => {
  console.log("In get_all_offers");

  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  // Fetch all offers from the database
  const offers = await Offer.find({}).skip(skip).limit(limit);

  const offers_count = await Offer.countDocuments();

  const totalPages = Math.ceil(offers_count / limit);

  res.status(200).json({ offers, currentPage: page, totalPages });
});

// @desc for adding a new offer
// POST /api/admin/offers
export const add_new_offer = AsyncHandler(async (req, res) => {
  console.log("In add_new_offer");

  const { name, value, target, targetId, targetName, endDate } = req.body;

  // Create a new offer
  const new_offer = await Offer.create({
    name,
    offer_value: value,
    target_type: target,
    target_id: targetId,
    target_name: targetName,
    end_date: endDate,
  });

  if (target === "product") {
    const product = await Product.findById(targetId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (value > product?.offer?.offer_value || product?.offer == null) {
      product.offer = new_offer._id;
    }
    await product.save();
  } else if (target === "category") {
    const products = await Product.find({ category: targetId }).populate(
      "offer"
    );
    for (const product of products) {
      if (value > product?.offer?.offer_value || product?.offer == null) {
        product.offer = new_offer._id;
      }
      await product.save();
    }
  }

  console.log("product added ==>", new_offer);

  res.status(201).json({ success: true, new_offer });
});

// @desc for deleting offer
// DELETE /api/admin/offers
export const delete_offer = AsyncHandler(async (req, res) => {
  console.log("In delete_offer");

  const { offerId } = req.body;

  const current_offer = await Offer.findById(offerId);

  const offer = await Offer.deleteOne({ _id: offerId });

  if (!offer) {
    return res.status(404).json({ success: false, message: "Offer not found" });
  }

  if (current_offer.target_type == "product") {
    const product_data = await Product.findById(current_offer.target_id);

    if (
      product_data &&
      product_data.offer &&
      product_data.offer.target_type === "product"
    ) {
      product_data.offer = null;
    }

    await product_data.save();
  }

  if (current_offer.target_type == "category") {
    const product_data = await Product.findById(current_offer.target_id);

    if (
      product_data &&
      product_data.offer &&
      product_data.offer.target_type === "category"
    ) {
      product_data.offer = null;
    }
  }

  res.status(200).json({ success: true, message: "Offer deleted" });
});
