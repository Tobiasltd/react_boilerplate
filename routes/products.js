const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const Product = require("../models/Product");

// @route   GET  api/Product
// @desc    Get all Products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   POST  api/Product
// @desc    Add Product
// @access  Admin
router.post("/", admin, async (req, res) => {
  const { sku, name, price, description, img } = req.body;
  try {
    let product = await Product.findOne({ sku });
    if (product) {
      return res
        .status(400)
        .json({ msg: "A product with this sku already exists" });
    }

    const newProduct = new Product({
      sku,
      name,
      price,
      description,
      img,
    });

    product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   PUT  api/Product/:id
// @desc    Edit Product
// @access  Admin
router.put("/:id", admin, async (req, res) => {
  const { sku, name, price, description, img } = req.body;
  // Build product object
  const productFields = {};
  if (sku) productFields.sku = sku;
  if (name) productFields.name = name;
  if (price) productFields.price = price;
  if (description) productFields.description = description;
  if (img) productFields.img = img;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});
// @route   DELETE  api/Product/:id
// @desc    Delete Product
// @access  Admin
router.delete("/:id", admin, async (req, res) => {
  try {
    // Find blog
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Delete blog
    await Product.findByIdAndRemove(req.params.id);
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
