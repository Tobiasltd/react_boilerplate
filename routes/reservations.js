const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Reservation = require("../models/Reservation");

// @route   GET  api/reservations
// @desc    Get all reservations
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(reservations);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   POST  api/reservations
// @desc    Add reservations
// @access  Private
router.post("/", auth, async (req, res) => {
  const { location, weekday, time } = req.body;
  try {
    let reservation = await Reservation.findOne({ weekday });
    if (reservation) {
      return res
        .status(400)
        .json({ msg: "You are only permitted one reservation per day" });
    }

    const newReservation = new Reservation({
      location,
      weekday,
      time,
      user: req.user.id,
    });

    reservation = await newReservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE  api/reservations/:id
// @desc    Delete reservation
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find reservation
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ msg: "Reservation not found" });

    // Make sure user owns reservation
    if (reservation.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete reservation
    await Reservation.findByIdAndRemove(req.params.id);
    res.json({ msg: "Reservation removed" });
  } catch (err) {
    console.error(`${err.message}`.red.bold);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
