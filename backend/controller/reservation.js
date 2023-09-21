const Book = require("../models/book");
const User = require("../models/user");
const Reservation = require("../models/reservation");
const sendgrid = require("../send-grid");
// const sgMail = require("@sendgrid/mail");

module.exports.index = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({})
      .populate("book", "name")
      .populate("reservedBy", "name");
    res.status(200).json({
      message: `Found ${reservations.length} reservations`,
      reservations,
    });
  } catch (error) {
    res.status(404).json({
      message: `No reservations found`,
      reservations: [],
    });
  }
};

module.exports.findReservationsByBookId = async (req, res, next) => {
  try {
    const books = await Reservation.find({ book: req.params.bookId })
      .populate("book", "name")
      .populate("reservedBy", "name");
    res.status(200).json({ message: `Found ${books.length} books`, books });
  } catch (error) {
    res.status(404).json({ message: "No books found", books: [] });
  }
};

module.exports.confirmReservationsNotExceeded = async (req, res, next) => {
  try {
    const today = new Date();
    // find last 5 reservations for the user
    const last5Reservations = await Reservation.find(
      {
        reservedBy: req.userData.userId,
      },
      "reserveDate"
    )
      .sort({ reserveDate: -1 })
      .limit(5);
    let reservationsToday = 0;
    for (let reservation of last5Reservations) {
      if (today.toISOString() === reservation.reserveDate.toISOString()) {
        reservationsToday++;
      }
    }
    if (reservationsToday >= 4) {
      throw new Error(
        "You can only reserve five books in one day. Please try again tomorrow"
      );
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports.add = async (req, res, next) => {
  try {
    const newReservation = new Reservation({
      book: req.body.book,
      reservedBy: req.body.reservedBy,
      reserveDate: new Date(),
      returnDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    });

    const reservation = await newReservation.save();
    const book = await Book.findById(req.body.book).select("name author");
    const user = await User.findById(req.userData.userId).select("name email");

    // TODO: Reneable to send email
    sendgrid.sendReservationMessgeToUser(user, book, reservation);
    sendgrid.sendReservationMessgeToAdmin(user, book, reservation);

    res.status(200).json({
      message:
        "Book resevation received. We will respond via email with information about approval and next steps",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. " + error.message });
  }
};

module.exports.findReservationsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const reservations = await Reservation.find({ reservedBy: userId })
      .populate("book")
      .populate("reservedBy", "name");
    res.status(200).json({
      message: `Found ${reservations.length} reservations for user ${reservedBy.name} `,
      reservations,
    });
  } catch (e) {
    res.status(404).json({
      message: "Unable to find reservations for user",
      reservations: [],
    });
  }
};
