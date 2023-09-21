const Book = require("../models/book");
const fuzzySearch = require("fuzzy-search");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  const { category, type } = req.query;
  const pageSize = +req.query.resultsCount;
  const currentPage = +req.query.currentPage;
  const bookQuery = Book.find({});
  const bookQueryByCategoryOnly = Book.find({ category });
  const bookQueryByTypeOnly = Book.find({ type });
  const bookQueryByTypeandCategory = Book.find({ type, category });

  let books = [];
  if (type === "all" && category === "all") {
    books = await bookQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  } else if (type === "all" && category !== "all") {
    books = await bookQueryByCategoryOnly
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  } else if (type !== "all" && category === "all") {
    books = await bookQueryByTypeOnly
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  } else if (type !== "all" && category !== "all") {
    books = await bookQueryByTypeandCategory
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  } else {
    books = await bookQuery;
  }

  if (books.length === 0) {
    res.status(200).json({ message: "No books found" });
  } else {
    res.status(200).json({ message: `${books.length} books found`, books });
  }
};

module.exports.createBook = async (req, res, next) => {
  const book = new Book(req.body);
  if (req.file) {
    book.image.url = req.file.path;
    book.image.filename = req.file.filename;
  } else {
    book.image.url =
      "https://res.cloudinary.com/daley-design/image/upload/v1663691027/LibraryApp/No_Book_Cover_Available_yacu9t.jpg";
    book.image.filename = "No_Book_Cover_Available_yacu9t";
  }
  try {
    await book.save();
    res
      .status(200)
      .json({ message: `Book ${book.name} created successfully`, book });
  } catch (err) {
    res.status(500).json({ message: `Create a book failed ${err.message}` });
  }
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const bookForDeletion = await Book.findById(id);
    // TODO:Confirm this is working as expected
    cloudinary.removeImage(bookForDeletion.filename);
    const result = await Book.deleteOne({
      _id: id,
    });
    //send different respons based on if book deletion is successful
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ message: `Book ${bookForDeletion.name}deleted succesfully` });
    }
  } catch (err) {
    res.status(500).json({ message: "Book deletion failed" });
  }
};

module.exports.show = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json({ message: `Found book ${book.name}`, book });
  } catch (e) {
    res.status(500).json({ message: "Book not found", book: [] });
  }
};

module.exports.getCategories = async (req, res, next) => {
  const categories = await Book.find().distinct("category");
  if (categories.length === 0) {
    res.status(500).json({ message: "No categories found", categories });
  } else {
    res.status(200).json({
      message: `${categories.length} distinct categories found`,
      categories,
    });
  }
};

// TODO:Complete review
module.exports.search = async (req, res, next) => {
  const { name } = req.query;
  const books = await Book.find();
  const searcher = new fuzzySearch(books, ["name", "category"], {
    caseSensitive: false,
  });
  const result = searcher.search(name);
  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
};

module.exports.updateBook = async (req, res, next) => {
  try {
    //find Book
    const bookForUpdate = await Book.findById(req.params.id);
    if (bookForUpdate.length === 0) {
      throw new Error("Could not find book to update");
    }

    bookForUpdate.name = req.body.name;
    bookForUpdate.type = req.body.type;
    bookForUpdate.author = req.body.author;
    bookForUpdate.category = req.body.category;
    bookForUpdate.availability = req.body.availability;
    bookForUpdate.description = req.body.description;
    if (req.file) {
      //delete image in cloudinary if it isn't the placeholder
      if (bookForUpdate.image.filename !== "No_Book_Cover_Available_yacu9t") {
        //Remove current image
        cloudinary.uploader
          .destroy(bookForUpdate.image.filename)
          .then((result) => {
            console.log("RESULTS:", result);
          });
      }
      //Set new book image to whatever was uploaded
      bookForUpdate.image.url = req.file.path;
      bookForUpdate.image.filename = req.file.filename;
    }
    const result = await bookForUpdate.save();
    res.status(200).json({
      message: `Book ${bookForUpdate.name} updated succesfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Book update failed. please try again",
        error: error.message,
      });
  }
};
