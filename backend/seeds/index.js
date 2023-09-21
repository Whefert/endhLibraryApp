const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Book = require("../models/book");
const User = require("../models/user");
const csv = require("csv-parser");
const fs = require("fs");
const books = [];

// //Local Connection
mongoose.connect("mongodb://localhost:27017/library-app");

// const uri = `mongodb+srv://whefert:HUQbYsLj1UUHyCU2@cluster0.sfw9l.mongodb.net/?retryWrites=true&w=majority`;
// mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (data) => books.push(data))
  .on("end", async () => {
    const result = await Book.deleteMany({});
    for (let book of books) {
      const newBook = new Book({
        name: book.name,
        author: book.author,
        type: book.type,
        availability: book.availability,
        category: book.category,
        description: book.description,
        image: { url: "", filename: "" },
      });
      await newBook.save();
    }
    console.log(result);
    db.close().then(console.log("Database closed"));
  });
