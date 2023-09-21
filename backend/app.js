const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");
const reservationRoutes = require("./routes/reservation");

// //Local Connection
mongoose.connect("mongodb://localhost:27017/library-app");

// const uri = `mongodb+srv://whefert:${process.env.MONGODB_PASSWORD}@cluster0.sfw9l.mongodb.net/?retryWrites=true&w=majority`;
// mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/books", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Hello, thanks for visiting" });
});
module.exports = app;
