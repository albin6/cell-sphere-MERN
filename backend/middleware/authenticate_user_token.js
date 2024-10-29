import jwt from "jsonwebtoken";

export const authenticate_user_token = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    console.log(decode);
    req.user = decode; // Attach the user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("JWT verification error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
