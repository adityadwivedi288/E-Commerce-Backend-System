import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const verifyAccessToken = async(req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password")
    if(!user){
      throw  new ApiError(400,"user not found")
    }
     // Agar user blocked hai, lekin wo /unblock-user/ route call kar raha hai, to allow kar do
    if(user.isBlocked && !req.originalUrl.includes("/unblock-user")){
      return res
      .status(403)
      .json(new ApiResponse(403,"Your Account is Blocked"))
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


// Admin only
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next()
  }
  throw new ApiError(403,"admin acess required")
};

//  Vendor only
export const isVendor = (req, res, next) => {
  if (req.user.role === "vendor") {
    return next()
  }
  throw new ApiError(403,"vendor acess required")
}; 

// Customer only
export const isCustomer = (req, res, next) => {
  if (req.user.role === "user") {
   return next();
  }
  throw new ApiError(403,"customer acess required")
};

// isVendorOrAdmin
export const isVendorOrAdmin = (req,res,next)=>{
  if(req.user.role==="vendor" || req.user.role==="admin"){
    return next()
  }
  throw new ApiError(403,"Access denied")
}


