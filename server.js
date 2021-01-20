const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.json({ msg: "Welcome to the react gym api" }));

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/authAdmin", require("./routes/authAdmin"));
app.use("/api/admins", require("./routes/admins"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/products", require("./routes/products"));
app.use("/api/reservations", require("./routes/reservations"));
app.use("/api/cart", require("./routes/cart"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`.cyan));
