//import mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationScehema = new Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvalStatus: { type: Boolean, required: true, default: false },
  reserveDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  // approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Reservation", reservationScehema);
