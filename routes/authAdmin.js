const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const admin = require("../middleware/admin");
const { check, validationResult } = require("express-validator");

const Admin = require("../models/Admin");

// @route   GET  api/authAdmins
// @desc    Get logged in admin
// @access  Private
router.get("/", admin, async (req, res) => {
  try {
    // admin middleware gives back an ID in the form of req.admin.id to match against our mongoDB admins
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   POST  api/authAdmins
// @desc    Auth admin & get token
// @access  Public
router.post(
  "/",
  // Validate email and password admin input
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if admin exists by checking email
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Check if password matches that of found admin-email above
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        admin: {
          id: admin.id,
        },
      };

      // Create token to stay logged in
      jwt.sign(
        payload,
        config.get("jwtSecretAdmin"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(`${err.message}`.red.bold);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
