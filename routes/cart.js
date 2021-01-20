const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");

// @route   GET  api/cart
// @desc    Get all products in cart
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id });
    res.json(cart);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   POST  api/cart
// @desc    Add   cart
// @access  Private
router.post("/", auth, async (req, res) => {
  const { product } = req.body;
  const { id } = req.user;
  try {
    let cart = await Cart.findOne({ user: id });

    if (cart) {
      return res.status(400).json({ msg: "Cart already exists" });
    } else {
      const products = [];
      products.push(product);

      const newCart = new Cart({
        products,
        user: id,
      });

      cart = await newCart.save();
      console.log(`New cart created and ${product.name} added to cart`.magenta);
    }

    res.json(cart);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   PUT  api/cart/:id/addproduct
// @desc    Add product to cart
// @access  Private
router.put("/:id/addproduct", auth, async (req, res) => {
  const { product } = req.body;

  try {
    let cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // Make sure user owns cart
    if (cart.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    cart.products.push(product);

    await Cart.findByIdAndUpdate(req.params.id, { $set: cart }, { new: true });

    console.log(`Product ${product.name} added to cart`.magenta);
    res.json(cart);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   PUT  api/cart/:id
// @desc    Edit quantity of product in cart
// @access  Private
router.put("/:id/editproduct", auth, async (req, res) => {
  const { product } = req.body;
  const { sku } = product;

  try {
    let cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // Make sure user owns cart
    if (cart.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // Remove product from cart
    cart.products = cart.products.filter((product) => product.sku !== sku);
    // Re-add product to cart, but now with new quantity
    cart.products.push(product);

    await Cart.findByIdAndUpdate(req.params.id, { $set: cart }, { new: true });

    res.json(cart);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   PUT  api/cart/:id
// @desc    Remove product from cart
// @access  Private
router.put("/:id/removeproduct", auth, async (req, res) => {
  const { product } = req.body;
  const { sku } = product;

  try {
    let cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // Make sure user owns cart
    if (cart.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // Remove product from cart
    cart.products = cart.products.filter((product) => product.sku !== sku);

    await Cart.findByIdAndUpdate(req.params.id, { $set: cart }, { new: true });

    res.json(cart);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE  api/cart/:id
// @desc    Delete product from cart
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find cart
    let cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // Make sure user owns cart
    if (cart.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete cart
    await Cart.findByIdAndRemove(req.params.id);
    res.json({ msg: "Cart removed" });
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
