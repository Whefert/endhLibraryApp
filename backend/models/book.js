const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const bookSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  category: {
    type: String,
    // required: true
  },
  availability: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  image: {
    url: { type: String },
    filename: { type: String },
  },
  description: {
    type: String,
    required: true,
  },
  // TODO:Add later when admin dashboard built out
  // addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Book", bookSchema);
