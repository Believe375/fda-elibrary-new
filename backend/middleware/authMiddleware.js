// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: "Not authorized as admin" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Token failed or unauthorized" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;