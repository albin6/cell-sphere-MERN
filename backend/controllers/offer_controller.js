import AsyncHandler from "express-async-handler";
import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";

// @desc for getting all offers
// GET /api/admin/offers
export const get_all_offers = AsyncHandler(async (req, res) => {
  console.log("In get_all_offers");

  // Fetch all offers from the database
  const offers = await Offer.find({});

  res.status(200).json({ offers });
});

// @desc for adding a new offer
// POST /api/admin/offers
export const add_new_offer = AsyncHandler(async (req, res) => {
  console.log("In add_new_offer");

  const { name, type, value, target, targetId, targetName, endDate } = req.body;

  if (target === "product") {
    const product = await Product.findById(targetId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    product.discount = value;

    await product.save();
  } else if (target === "category") {
    const products = await Product.find({ category: targetId });
    for (const product of products) {
      product.discount = value;
      await product.save();
    }
  }

  // Create a new offer
  const new_offer = await Offer.create({
    name,
    offer_type: type,
    offer_value: value,
    target_type: target,
    target_id: targetId,
    target_name: targetName,
    end_date: endDate,
  });

  console.log("product added ==>", new_offer);

  res.status(201).json({ success: true, new_offer });
});

// @desc for deleting offer
// DELETE /api/admin/offers
export const delete_offer = AsyncHandler(async (req, res) => {
  console.log("In delete_offer");

  const { offerId } = req.body;

  const offer = await Offer.deleteOne({ _id: offerId });

  if (!offer) {
    return res.status(404).json({ success: false, message: "Offer not found" });
  }

  res.status(200).json({ success: true, message: "Offer deleted" });
});
