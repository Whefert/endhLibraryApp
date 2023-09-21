const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const books = require("../controller/book");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const checkPriveledge = require("../middleware/check-priveledge");

router
  .route("/")
  .get(books.index)
  .post(
    checkAuth,
    checkPriveledge,
    multer({ storage }).single("image"),
    books.createBook
  );

router.get("/search", books.search);

router.route("/categories").get(books.getCategories);

router
  .route("/:id")
  .get(books.show)
  .delete(checkAuth, checkPriveledge, books.deleteBook)
  .put(
    checkAuth,
    checkPriveledge,
    multer({ storage }).single("image"),
    books.updateBook
  );

module.exports = router;
