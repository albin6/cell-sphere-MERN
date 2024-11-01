import AsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { format_date } from "../utils/date-formatter/format-date.js";
import { return_eligible_date } from "../utils/date-formatter/return-eligible-date.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Wallet from "../models/walletModel.js";
import SalesReport from "../models/salesModel.js";

const createSalesReport = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("order_items.product");

    if (!order) {
      console.log("Order not found");
      return;
    }

    // Initialize an array to hold the product details for the report entry
    const products = order.order_items.map((item) => {
      const itemTotalPrice = item.price * item.quantity;
      const discountAmount = (item.discount / 100) * itemTotalPrice;

      return {
        product_id: item.product._id,
        productName: item.product.name || "Product Name", // Assuming the product schema has a name field
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: itemTotalPrice,
        discount: discountAmount,
        couponDeduction: order.coupon_discount || 0,
      };
    });

    // Calculate the final amount
    const finalAmount =
      order.total_price_with_discount ||
      order.total_amount - order.coupon_discount;

    // Create a single sales report entry for the order
    const reportEntry = {
      orderId: order._id,
      product: products,
      finalAmount: finalAmount,
      orderDate: order.placed_at,
      customer: order.user._id,
      paymentMethod: order.payment_method,
      deliveryStatus: order.order_items[0].order_status, // Assuming all items have the same status
    };

    // Insert the entry into the SalesReport collection
    await SalesReport.create(reportEntry);

    console.log("Sales report entry created successfully!");
  } catch (error) {
    console.error("Error creating sales report:", error);
  }
};

// =============================================================================
// user side
// =============================================================================

// for placing an order
export const place_order = AsyncHandler(async (req, res) => {
  console.log("in place_order");

  const { order_data } = req.body;

  console.log("===================================");
  console.log(order_data);
  console.log("===================================");

  const new_order = new Order({ ...order_data, user: req.user.id });

  if (order_data.payment_method === "Wallet") {
    let wallet_exists = await Wallet.findOne({ user: req.user.id });
    console.log(wallet_exists);

    if (wallet_exists) {
      if (!(wallet_exists.balance >= new_order.total_price_with_discount)) {
        return res.status(400).json({
          message: "Insufficient balance in your wallet",
        });
      }
      wallet_exists.balance -= new_order.total_price_with_discount;

      const transaction = {
        order_id: new_order._id,
        transaction_date: new Date(),
        transaction_type: "debit",
        transaction_status: "completed",
        amount: new_order.total_price_with_discount * -1,
      };

      wallet_exists.transactions.push(transaction);

      await wallet_exists.save();
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient balance in your wallet. Please add balance first.",
      });
    }
  }

  if (new_order) {
    // Loop through each order item to update the stock
    for (const item of order_data.order_items) {
      const { product, variant, quantity } = item;

      // Find the product by ID
      const product_data = await Product.findById(product);

      if (product_data) {
        // Find the specific variant within the product's variants array
        const variant_data = product_data.variants.find(
          (v) => v.sku === variant
        );

        // Check if the variant exists and has enough stock
        if (variant_data && variant_data.stock >= quantity) {
          // Reduce the stock by the quantity purchased
          variant_data.stock -= quantity;
        } else {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for variant: ${variant}`,
          });
        }

        // Save the updated product with the modified variant stock
        await product_data.save();
      }
    }
    await Cart.updateOne(
      { user: req.user.id },
      {
        $pull: {
          items: {
            product: {
              $in: order_data.order_items.map((item) => item.product),
            },
          },
        },
      }
    );
  }
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0);

    // Step 3: Update the cart with the new totalAmount
    await cart.save();
  }

  // Save the order after updating the stock
  await new_order.save();

  await createSalesReport(new_order._id);

  res.json({ success: true, order_id: new_order._id });
});

// for getting user specific orders
export const get_user_specific_orders = AsyncHandler(async (req, res) => {
  console.log("in get_all_orders");

  const user_id = req.user.id;

  const orders = await Order.find({ user: user_id })
    .populate("user")
    .populate("order_items.product");

  const order_data = orders.map((order) => {
    const eligibleReturnDate = return_eligible_date(order.placed_at);

    return {
      delivery_date: format_date(order.delivery_by),
      date: format_date(order.placed_at),
      total: order.total_price_with_discount,
      customerName: order.user.first_name + " " + order.user.last_name,
      orderItems: order.order_items.map((item) => {
        const product = item.product;
        const variant = product.variants.find((v) => v.sku === item.variant); // Matching the variant in the order with the product variant

        return {
          productName: `${product.name} ( ${variant.ram}, ${variant.storage}, ${variant.color} )`,
          image: variant.images[0], // Assuming the first image is used
          price: item.total_price,
          id: item._id,
          status: item.order_status,
          sku: item.variant,
          return_eligible:
            Date.now() <= eligibleReturnDate
              ? "Eligible for return"
              : "Not eligible to return",
        };
      }),
      id: order._id,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
    };
  });

  res.json({ success: true, order_data });
});

// for getting specific order details of a customer
export const get_specific_order_details = AsyncHandler(async (req, res) => {
  console.log("in get_specific_order_details");

  const order_id = req.params.orderId;

  const order = await Order.findById(order_id)
    .populate("user")
    .populate("order_items.product");

  console.log(order);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const eligibleReturnDate = return_eligible_date(order.placed_at);

  res.json({
    success: true,
    order_data: {
      deliveryBy: format_date(order.delivery_by),
      date: format_date(order.placed_at),
      total: order.total_price_with_discount,
      customerName: order.user.first_name + " " + order.user.last_name,
      orders: order,
    },
  });
});

// for cancelling and order
export const cancel_order = AsyncHandler(async (req, res) => {
  console.log("In cancel_order_item");

  const { orderId } = req.params;
  const { sku } = req.body;

  if (!orderId || !sku) {
    return res.status(400).json({
      success: false,
      message: "Both Order ID and sku are required",
    });
  }

  // Find the order by ID
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const orderItem = order.order_items.find((item) => item.variant == sku);

  if (!orderItem) {
    return res
      .status(404)
      .json({ success: false, message: "Order item not found" });
  }

  if (orderItem.order_status === "Cancelled") {
    return res.status(400).json({
      success: false,
      message: "Order item is already canceled",
    });
  }

  // Update the status of the specific item to "Cancelled"
  orderItem.order_status = "Cancelled";

  // Handle refund if payment method is Wallet or Paypal
  if (["Wallet", "Paypal"].includes(order.payment_method)) {
    let user_wallet = await Wallet.findOne({ user: req.user.id });

    if (!user_wallet) {
      user_wallet = new Wallet({
        user: req.user.id,
        balance: 0,
        transactions: [],
      });
    }

    const refundAmount = orderItem.price * (1 - orderItem.discount / 100);
    user_wallet.balance += refundAmount;

    user_wallet.transactions.push({
      transaction_date: new Date(),
      transaction_type: "credit",
      transaction_status: "completed",
      amount: refundAmount,
    });

    await user_wallet.save();
  }

  const { product, quantity } = orderItem;
  const productData = await Product.findById(product);

  if (productData) {
    const variantData = productData.variants.find((v) => v.sku === sku);

    if (variantData) {
      variantData.stock += quantity;
      await productData.save();
      console.log("stock quantity updated");
    }
  }

  // Update delivery status in the sales report
  await SalesReport.updateOne(
    { orderId: order._id, product: product },
    { deliveryStatus: "Cancelled" }
  );

  await order.save();

  res.json({ success: true, message: "Order item cancelled successfully" });
});

// =============================================================================
// admin side
// =============================================================================

// for getting all orders
export const get_all_orders = AsyncHandler(async (req, res) => {
  console.log("in get_all_orders");

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalOrdersCount = await Order.countDocuments({});

    // Fetch orders with pagination
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "first_name last_name",
      })
      .populate({
        path: "order_items.product",
        select: "name variants",
      })
      .sort({ placed_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPages = Math.ceil(totalOrdersCount / limit);

    const formattedOrders = orders.map((order) => {
      return {
        user_full_name: `${order.user.first_name} ${order.user.last_name}`,
        order_items: order.order_items.map((item) => {
          const product = item.product;

          // Find variant details if available
          const variantDetails = product.variants.find(
            (variant) =>
              variant.sku === item.variant || variant.color === item.variant
          );

          return {
            product_name: product.name,
            sku: item.variant,
            variant: {
              color: variantDetails?.color || item.variant,
              ram: variantDetails?.ram || "N/A",
              storage: variantDetails?.storage || "N/A",
            },
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            total_price: item.total_price,
            order_status: item.order_status, // Include item-specific order status
          };
        }),
        _id: order._id,
        payment_status: order.payment_status,
        placed_at: order.placed_at,
      };
    });

    res.json({ success: true, totalPages, page, orders: formattedOrders });
  } catch (error) {
    console.error("Error in get_all_orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// for updating order status
export const update_order_status = AsyncHandler(async (req, res) => {
  console.log("in update_order_status");

  const order_id = req.params.orderId;
  const { status: new_status, sku } = req.body;

  console.log(sku);
  try {
    // Find the order by ID
    const order = await Order.findById(order_id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log(order);
    // Find the specific product in the order items
    const item = order.order_items.find(
      (orderItem) => orderItem.variant == sku
    );

    console.log(item);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in order" });
    }

    // Update the order status of the specific item
    item.order_status = new_status;
    let sales_id;
    await SalesReport.updateOne(
      { orderId: order._id, product: item.product },
      { deliveryStatus: new_status }
    );
    // Handle stock adjustment and wallet refund if status is "Cancelled"
    if (new_status === "Cancelled") {
      const { product, variant, quantity, price, discount } = item;

      // Update the stock for the specific variant of the product
      const productData = await Product.findById(product);
      if (productData) {
        const variantData = productData.variants.find((v) => v.sku === variant);
        if (variantData) {
          console.log("quantity updated to " + variantData);
          variantData.stock += quantity;
          await productData.save();
        }
      }

      // Process refund if payment method is not "Cash on Delivery"
      if (order.payment_method !== "Cash on Delivery") {
        let user_wallet = await Wallet.findOne({ user: req.user.id });
        if (!user_wallet) {
          user_wallet = new Wallet({
            user: req.user.id,
            balance: 0,
            transactions: [],
          });
        }

        // Calculate refund amount
        const refundAmount = price * (1 - discount / 100);
        user_wallet.balance += refundAmount;

        await SalesReport.updateOne(
          { orderId: order._id, product: item.product },
          { finalAmount: refundAmount }
        );

        // Record the refund transaction
        user_wallet.transactions.push({
          transaction_date: new Date(),
          transaction_type: "credit",
          transaction_status: "completed",
          amount: refundAmount,
        });

        await user_wallet.save();
      }

      // Update SalesReport for the specific product within the order
    }

    // Save the updated order
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in update_order_status:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update order status" });
  }
});
