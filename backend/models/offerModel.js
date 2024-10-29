import mongoose from "mongoose";

const offer_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  offer_type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  offer_value: {
    type: Number,
    required: true,
  },
  target_type: {
    type: String,
    enum: ["product", "category"],
    required: true,
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // You may want to use a discriminator or reference depending on your design
    // ref: 'Product' or ref: 'Category' can be used if you have Product and Category models
  },
  target_name: {
    type: String,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
});

offer_schema.index({ end_date: 1 }, { expireAfterSeconds: 0 });

const Offer = mongoose.model("offer", offer_schema);

export default Offer;
