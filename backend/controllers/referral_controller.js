import AsyncHandler from "express-async-handler";

export const verify_referral_code = AsyncHandler(async (req, res) => {
  const { code } = req.body;
  console.log(code);
});
