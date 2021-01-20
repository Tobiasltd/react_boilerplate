const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const Admin = require("../models/Admin");

// @route   POST  api/admins
// @desc    Register an admin
// @access  Public
router.post(
  "/",
  // Validate user input
  [
    check("name", "Please add a name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // See if admin (email) doesn't already exist
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({ msg: "Admin already exists" });
      }

      // Create new admin, Admin from Models
      admin = new Admin({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);

      // Save admin to DB
      await admin.save();

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
