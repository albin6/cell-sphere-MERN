import mongoose from "mongoose";

const banner_schema = new mongoose.Schema({
  description: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  heading_one: {
    type: String,
  },
  heading_four: {
    type: String,
  },
});

const Banner = mongoose.model("banner", banner_schema);

export default Banner;
