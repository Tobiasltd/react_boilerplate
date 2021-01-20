const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const Blog = require("../models/Blog");

// @route   GET  api/blog
// @desc    Get all blogs
// @access  Public
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      date: -1,
    });
    res.json(blogs);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   POST  api/blog
// @desc    Add blog
// @access  Admin
router.post("/", admin, async (req, res) => {
  const { title, topic, writtenby, text, imgheader } = req.body;
  try {
    let blog = await Blog.findOne({ title });
    if (blog) {
      return res
        .status(400)
        .json({ msg: "A blog with this title already exists" });
    }

    const newBlog = new Blog({
      title,
      topic,
      writtenby,
      text,
      imgheader,
    });

    blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   PUT  api/blog/:id
// @desc    Edit blog
// @access  Private
router.put("/:id", admin, async (req, res) => {
  const { title, topic, writtenby, text, imgheader } = req.body;
  // Build blog object
  const blogFields = {};
  if (title) blogFields.title = title;
  if (topic) blogFields.topic = topic;
  if (writtenby) blogFields.writtenby = writtenby;
  if (text) blogFields.text = text;
  if (imgheader) blogFields.imgheader = imgheader;

  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: blogFields },
      { new: true }
    );

    res.json(blog);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE  api/blog/:id
// @desc    Delete blog
// @access  Private
router.delete("/:id", admin, async (req, res) => {
  try {
    // Find blog
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // Delete blog
    await Blog.findByIdAndRemove(req.params.id);
    res.json({ msg: "Blog removed" });
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
