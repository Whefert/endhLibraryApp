const express = require("express");
const router = express.Router();
const reviews = require("../controller/review");

router.route("/").get(reviews.index).post(reviews.add);
router.route("/delete/:reviewId").delete(reviews.delete);
router.route("/:bookId").get(reviews.find);

module.exports = router;
