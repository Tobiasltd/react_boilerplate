const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  writtenby: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  imgheader: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("blog", BlogSchema);
