import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  image_url: {
    type: String,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
});

const User = mongoose.model("user", user_schema);

export default User;
