import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variant: {
        type: String,
        required: true, // it store the sku
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },
      discount: {
        type: Number,
        required: true,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre("save", function (next) {
  // Calculate totalAmount based on all items in the cart.
  this.totalAmount = this.items.reduce((acc, item) => {
    return acc + item.totalPrice;
  }, 0);

  this.updatedAt = Date.now();
  next();
});

cartSchema.index({ user: 1 });

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
