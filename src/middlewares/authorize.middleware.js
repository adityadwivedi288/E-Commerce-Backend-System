// Har route me user ka role check karega
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user.role => login hone ke baad token me user ka role hota hai
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You don't have permission",
      });
    }
    next();
  };
};
