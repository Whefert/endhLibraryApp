const Review = require("../models/review");

module.exports.index = async (req, res, next) => {
  const allReviews = await Review.find();
  res.status(200).json(allReviews);
};

module.exports.add = async (req, res, next) => {
  const { body, author, rating, bookId } = req.body;
  const newReview = new Review({ body, author, rating, bookId });
  await newReview.save();
  res.status(200).json({ message: "Success" });
};

module.exports.find = async (req, res, next) => {
  const bookId = req.params.bookId;
  const allReviews = await Review.find({ bookId: bookId }).populate(
    "author",
    "name"
  );
  res.status(200).json(allReviews);
};

module.exports.delete = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const deletedReview = await Review.findOneAndDelete({ reviewId });
  console.log(deletedReview);
  res
    .status(200)
    .json({ deletedReview, message: "Review deleted successfully" });
};
