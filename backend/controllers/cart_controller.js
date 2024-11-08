import AsyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

// ----------------------------------------------------------------------------
// for getting cart products
// ----------------------------------------------------------------------------
export const get_cart_products = AsyncHandler(async (req, res) => {
  console.log("In get_cart_products");

  const user_id = req.user.id;

  const cart_data = await Cart.findOne({ user: user_id }).populate(
    "items.product"
  );

  console.log(cart_data);

  if (!cart_data) {
    const cart_data = await Cart.create({ user: user_id });
    console.log(cart_data);
    return res.status(200).json({ success: true, cart_data });
  }

  res.status(200).json({ success: true, cart_data });
});

// ----------------------------------------------------------------------------
// for adding products to cart
// ----------------------------------------------------------------------------
export const add_product_to_cart = AsyncHandler(async (req, res) => {
  console.log("in add_product_to_cart");
  try {
    const user_id = req.user.id;
    const { sku, price } = req.body.selectedVariant;
    const { discount, offer } = req.body.product;
    const quantity = 1;

    console.log(price);

    console.log((price * discount) / 100);
    const discountAmount =
      (price * (discount + (offer?.offer_value ? offer.offer_value : 0))) / 100;
    const totalPrice = price - discountAmount;

    console.log(totalPrice);

    // Create cart item
    const cartItem = {
      product: req.body.product._id,
      variant: sku,
      quantity,
      price,
      discount: discount + (offer?.offer_value ? offer.offer_value : 0),
      totalPrice,
    };

    let cart = await Cart.findOne({ user: user_id });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user: user_id,
        items: [cartItem],
      });
    } else {
      const productExists = cart.items.some(
        (item) =>
          item.product.toString() === req.body.product._id &&
          item.variant === sku
      );

      if (productExists) {
        return res
          .status(400)
          .json({ success: false, message: "Product already in Cart" });
      }
      // Add item to existing cart
      cart.items.push(cartItem);
    }

    // Save the cart
    await cart.save();
    console.log("Product added to cart successfully:", cart);

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
});

// ----------------------------------------------------------------------------
// for checking the product variant exists in the cart
// ----------------------------------------------------------------------------
export const check_product_variant_in_cart = AsyncHandler(async (req, res) => {
  console.log("in check_product_variant_in_cart");

  const user_id = req.user.id;
  const { product_id, variant_sku } = req.query;

  console.log(product_id, variant_sku);

  const cart_data = await Cart.findOne({ user: user_id });
  console.log(cart_data);
  if (!cart_data) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  // Ensure product_id is a valid ObjectId
  const productObjectId = new mongoose.Types.ObjectId(product_id);

  const cart_item = cart_data.items.find(
    (item) =>
      item.product.equals(productObjectId) && item.variant === variant_sku
  );

  console.log(cart_item);

  if (!cart_item) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  }

  res.json({ success: true, cart: cart_item });
});

// ----------------------------------------------------------------------------
// for updating the quantity of product in the cart
// ----------------------------------------------------------------------------
export const update_product_quantity = AsyncHandler(async (req, res) => {
  console.log("in update_product_quantity");
  const user_id = req.user.id;
  const product_sku = req.params.productSKU;
  const quantity = req.body.quantity;

  console.log(user_id, product_sku, quantity);

  const cart_data = await Cart.findOne({ user: user_id });

  console.log(cart_data);

  cart_data.items.map((item) =>
    item.variant === product_sku ? (item.quantity = quantity) : item.quantity
  );

  console.log("After updating ===>", cart_data);

  await cart_data.save();

  res.json({ success: true, cart_data });
});

// ----------------------------------------------------------------------------
// for deleting a product from the cart
// ----------------------------------------------------------------------------
export const delete_product = AsyncHandler(async (req, res) => {
  console.log("in delete_product");
  const product_sku = req.params.productSKU;

  console.log(product_sku);

  const cart_data = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { items: { variant: product_sku } } },
    { new: true }
  );

  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0);

    // Step 3: Update the cart with the new totalAmount
    await cart.save();
  }

  console.log("after removing product from cart ===>", cart_data);

  res.json({ success: true, cart_data });
});
