import jwt from "jsonwebtoken";

 const generateAccessToken = (userId,role) => {
  return jwt.sign({ id: userId,role:role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

 const generateRefreshToken = (userId,role) => {
  return jwt.sign({ id: userId,role:role}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export {generateAccessToken,generateRefreshToken};
