const jwt = require("jsonwebtoken");
const { SECRET } = require("../constants"); 

exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Authentication token not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Access denied. Only admin can access this route.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }
};
