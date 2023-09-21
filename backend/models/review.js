//import mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;
const Book = require("../models/book");
const User = require("../models/user");
//create schema

const reviewSchema = new Schema({
  body: { type: String, required: true },
  rating: { type: Number, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book" },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    console.log(doc);
    const { bookId, _id: reviewId } = doc;
    const result = await Book.findByIdAndUpdate(bookId, {
      $pull: { reviews: reviewId },
    });
  }
});

module.exports = mongoose.model("Review", reviewSchema);
