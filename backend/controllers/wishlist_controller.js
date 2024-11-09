import AsyncHandler from "express-async-handler";

import Wishlist from "../models/wishlistModel.js";

// for getting all wishlist items
export const get_wishlist_products = AsyncHandler(async (req, res) => {
  console.log("in get_all_wishlist_products");

  const user_id = req.user.id;
  const wishlist_items = await Wishlist.find({ user: user_id }).populate({
    path: "items.product",
    match: { is_active: true },
  });

  if (!wishlist_items) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true, wishlists: wishlist_items });
});

// for adding a product to wishlist
export const add_product_to_wishlist = AsyncHandler(async (req, res) => {
  console.log("in add_product_to_wishlist");

  const user_id = req.user.id;
  const { productId, variant } = req.body;
  const sku = variant;

  // Check if the wishlist already exists for the user
  let wishlist = await Wishlist.findOne({ user: user_id });

  // Prepare the wishlist data to add
  const wishlist_data = {
    product: productId,
    variant: sku,
  };

  if (!wishlist) {
    // Create a new wishlist if it doesn't exist for the user
    wishlist = new Wishlist({
      user: user_id,
      items: [wishlist_data],
    });
  } else {
    // Check if the product with the specific SKU already exists in the items array
    const productExists = wishlist.items.some(
      (item) => item.product.toString() === productId && item.variant === sku
    );

    if (productExists) {
      return res
        .status(400)
        .json({ success: false, message: "Product already in wishlist" });
    }

    // Add the new product to the items array
    wishlist.items.push(wishlist_data);
  }

  // Save the updated or new wishlist
  await wishlist.save();

  res.status(201).json({ success: true, wishlist });
});

// for removing products from wishlist
export const remove_product_from_wishlist = AsyncHandler(async (req, res) => {
  console.log("in remove_product_from_wishlist");

  const user_id = req.user.id;
  const { productId, variant } = req.body;

  console.log(req.body);

  console.log(productId, variant, user_id);

  const wishlist = await Wishlist.findOne({ user: user_id });

  if (!wishlist) {
    return res
      .status(404)
      .json({ success: false, message: "Wishlist not found" });
  }

  const initialItemCount = wishlist.items.length;
  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId || item.variant !== variant
  );

  if (wishlist.items.length === initialItemCount) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in wishlist" });
  }

  // Save the updated wishlist after removing the item
  await wishlist.save();

  res.json({ success: true, message: "Product removed from wishlist" });
});

// for getting product is available in the wishlist
export const check_product_in_wishlist = AsyncHandler(async (req, res) => {
  console.log("in check_product_in_wishlist");

  const user_id = req.user.id;
  const { productId, variant } = req.query;

  console.log(productId, variant);

  const wishlist_item = await Wishlist.findOne({
    user: user_id,
    "items.product": productId, // Match product within the items array
    "items.variant": variant, // Match variant within the items array
  });

  console.log(wishlist_item);

  if (!wishlist_item) {
    return res.json({
      success: false,
      isInWishlist: false,
      message: "Product not found in wishlist",
    });
  }

  res.json({ success: true, isInWishlist: true });
});
