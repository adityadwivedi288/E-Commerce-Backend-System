import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { Token } from '../models/token.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

 const signup = asyncHandler(async (req, res) => {
 const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  const { password: pwd, ...userData } = newUser._doc;
  res
    .status(201)
    .json(new ApiResponse(201, userData, "Signup successful"));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // frontend se email & password milega
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // token generate karenge
  const accessToken = generateAccessToken(user._id,user.role);
  const refreshToken = generateRefreshToken(user._id,user.role); 
  // 4. Save refresh token in DB
  await Token.create({
    user: user._id,
    refreshToken,
  });
  res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, { user,accessToken }, "Login successful"));
});

// New Token Generate
 const refreshAccessToken = asyncHandler(async (req, res) => {
 const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  const existingToken = await Token.findOne({ refreshToken: incomingRefreshToken });

  if (!existingToken) {
    throw new ApiError(403, "Refresh token is invalid or expired");
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const newAccessToken = generateAccessToken(decoded.id);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: false, // local testing ke liye
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken: newAccessToken }, "Access token refreshed successfully"));
});

// Get single user from database 
const getUserProfile = asyncHandler(async(req,res)=>{
  const user =  await User.findById(req.user.id).select("-password")
  if(!user){
    throw new ApiError(401,"user not found")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,{user},"user profile fetchSucessFully"))
})

//updateProfile
const updateProfile = asyncHandler(async(req,res)=>{
  const userId = req.user._id;  // login usern from token
  const {name,email} = req.body;
  const user = await User.findById(userId)
  if(!user){
    throw new ApiError(400,"user not found")
  }
  // Update only if fields are provided
  if(name) user.name = name
  if(email) user.email = email

  const newUser = await user.save();
  return res
  .status(200)
  .json(new ApiResponse(200,{newUser},"user Update SucessFully"))
})

// get all user 
const getAllUser = asyncHandler(async(req,res)=>{
  const user = await User.find().select("-password")
  if(!user){
    throw new ApiError(401,"user not found")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,{user},"get all Data Fetch SucessFully"))  
})


// logout user
  const logoutUser = asyncHandler(async (req, res) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  if(!refreshTokenFromCookie){
      throw new ApiError(401, "Refresh token does not exist");
  }
  const checkDatabaseToken = await Token.findOneAndDelete({ refreshToken: refreshTokenFromCookie });
  if(!checkDatabaseToken){
      throw new ApiError(401, "RefreshToken Does't exist in Database");
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// block user
const blockUser = asyncHandler(async(req,res) => {
  const user = await User.findByIdAndUpdate(req.params.id,
    {isBlocked:true}, // jo field true ka matlab hota hai ki user block kar do
    {new:true}).select("-password")
  if(!user){
    throw new ApiError(401,"user not found")
  }  
  return res
  .status(201)
  .json(new ApiResponse(200,{user},"User Block SucessFully"))
})

//unblock user
const unBlockUser = asyncHandler(async(req,res)=>{
  const user = await User.findByIdAndUpdate(req.params.id,
    {isBlocked:false},
    {new:true}
  ).select("-password")
  if(!user){
    throw new ApiError(400,"user not found")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,{user},"user Unblock SucessFully"))
})

// Delete User
const deleteUser = asyncHandler(async(req,res)=>{
  const user = await User.findByIdAndDelete(req,params.id)
  if(!user){
    throw new ApiError(400,"user not found")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,{user},"user delete sucessFully"))
})

export {signup,
        loginUser,
        refreshAccessToken,
        getUserProfile,
        updateProfile,
        getAllUser,
        logoutUser,
        blockUser,
        unBlockUser,
        deleteUser
      };
      