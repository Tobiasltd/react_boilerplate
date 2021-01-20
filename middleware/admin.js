const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("admin-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecretAdmin"));
    // Pull out the admin so it is accessable in the route
    req.admin = decoded.admin;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// This middleware is for admin routes
