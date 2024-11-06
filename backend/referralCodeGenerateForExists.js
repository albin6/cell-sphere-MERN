import mongoose from "mongoose";
import User from "./models/userModel.js";

function generateReferralCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < 5; i++) {
    randomPart += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return `${timestamp}${randomPart}`;
}

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/cell-sphere", {
    // Replace with your database URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Find users who don't have a referral code and update them
    const usersWithoutReferralCode = await User.find({
      referral_code: { $exists: false },
    });

    for (let user of usersWithoutReferralCode) {
      user.referral_code = generateReferralCode();
      await user.save();
      console.log(
        `Updated user ${user._id} with referral code ${user.referral_code}`
      );
    }

    console.log("All users updated");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
