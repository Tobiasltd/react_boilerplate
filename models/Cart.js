const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
      sku: Number,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("cart", CartSchema);
