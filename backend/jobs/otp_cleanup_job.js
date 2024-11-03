import cron from "node-cron";
import OTP from "../models/otpModel.js";

cron.schedule("* * * * *", async () => {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const result = await OTP.deleteMany({ createdAt: { $lt: oneMinuteAgo } });
  console.log(`${result.deletedCount} expired OTP(s) deleted.`);
});
