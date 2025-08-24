import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1].trim();
      if (!token)
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token format" });
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password");
        if (!user) {
        console.log(`User not found with id: ${decoded.id}`);
        return res.status(401).json({ message: "User not found or account deleted" });
        
      }
      req.user = user;
      next();


    } catch (error) {
        console.log("Authentication error:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }
  else {
    console.log("No authorization header or not starting with Bearer");
    return res.status(401).json({ message: "Not authorized, no token provided" });
    
  }
};

export { protect }

// Middleware to check if user is a merchant
export const requireMerchant = (req, res, next) => {
  if (req.user && req.user.role === 'merchant') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Merchant role required." });
  }
};
