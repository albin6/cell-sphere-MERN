import AsyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import { set_token } from "../utils/jwt/setCookie.js";
import {
  compare_password,
  hash_password,
} from "../utils/secure-password/password-bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt/generateToken.js";
import jwt from "jsonwebtoken";

export const admin_login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const is_admin_exists = await Admin.findOne({ email });

  if (is_admin_exists) {
    console.log(await compare_password(password, is_admin_exists.password));
    if (await compare_password(password, is_admin_exists.password)) {
      const admin_data = {
        id: is_admin_exists._id,
        role: is_admin_exists.role,
      };
      const access_token = generateAccessToken(admin_data);
      const refresh_token = generateRefreshToken(admin_data);

      const new_refresh_token = new RefreshToken({
        token: refresh_token,
        user: is_admin_exists._id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 7d
      });

      await new_refresh_token.save();

      set_token(
        "admin_refresh_token",
        refresh_token,
        30 * 24 * 60 * 60 * 1000,
        res
      );

      res.json({
        message: "Login Success",
        access_token,
        admin: {
          id: admin_data.id,
          email: admin_data.email,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect" });
    }
  } else {
    res.status(404).json({ success: false, message: "Email Not Exists" });
  }
});

// POST /api/admin/logout
export const admin_logout = AsyncHandler(async (req, res) => {
  const admin_refresh_token = req.cookies["admin_refresh_token"];
  console.log(admin_refresh_token);

  await RefreshToken.deleteOne({ token: admin_refresh_token });

  res.cookie("admin_refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(204).json({ success: true, message: "logout successfully" });
});

// GET /api/admin/users-list
export const get_users_list = AsyncHandler(async (req, res) => {
  console.log("in get users list : req.user =>", req.user);

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const total_users_count = await User.countDocuments(
    {},
    {
      password: false,
      created_on: false,
    }
  );

  const totalPages = Math.ceil(total_users_count / limit);

  const users_list = await User.find({}, { password: false, created_on: false })
    .skip(skip)
    .limit(limit);
  console.log("In get users list => usersList:", users_list);

  res.json({ success: true, page, totalPages, users: users_list });
});

// patch /api/admin/users-list
export const update_user_status = AsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user_data = await User.findById(userId);

  console.log("update user status ; =>", user_data);

  if (!user_data) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  const is_currently_blocked = user_data.is_blocked;

  console.log("current status => ", is_currently_blocked);

  const updated_user_data = await User.findByIdAndUpdate(
    userId,
    { $set: { is_blocked: !is_currently_blocked } },
    { new: true }
  );

  console.log(updated_user_data);

  res.json({ success: true, updated_user_data });
});

// POST /api/admin/token
export const new_access_token_generate = AsyncHandler(async (req, res) => {
  const refresh_token = req.cookies.admin_refresh_token;
  console.log("Received refresh token:", refresh_token);

  if (!refresh_token) {
    console.log("No refresh token provided");
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const stored_refresh_token = await RefreshToken.findOne({
      token: refresh_token,
    });

    if (!stored_refresh_token) {
      console.log("Invalid refresh token");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (stored_refresh_token.expiresAt <= new Date()) {
      console.log("Refresh token expired");
      await RefreshToken.deleteOne({ token: refresh_token });
      return res
        .status(403)
        .json({ message: "Refresh token expired, please log in again." });
    }

    const decoded = jwt.decode(refresh_token);
    console.log("Decoded refresh token:", decoded);

    // Verify the token
    const user = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY);
    console.log("User after verifying refresh token:", user);

    const new_access_token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION }
    );

    console.log("New access token generated");
    return res.json({ access_token: new_access_token });
  } catch (error) {
    console.error("Error in token refresh:", error);
    if (error.name === "TokenExpiredError") {
      console.log("Refresh token expired:", error.expiredAt);
      await RefreshToken.deleteOne({ token: refresh_token });
      return res
        .status(403)
        .json({ message: "Refresh token expired, please log in again." });
    } else {
      console.log("Token verification failed:", error);
      return res.status(403).json({ message: "Token verification failed" });
    }
  }
});

// create admin

export const create_admin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const hashed_password = await hash_password(password);
  const admin = await Admin.create({
    email,
    password: hashed_password,
  });

  res.json({
    success: true,
    message: "Registeration Success",
  });
});
