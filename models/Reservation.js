const mongoose = require("mongoose");

// The first part 'user' refers to the fact that the output here is userspecific
const ReservationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  location: {
    type: String,
    required: true,
  },
  weekday: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("reservation", ReservationSchema);
