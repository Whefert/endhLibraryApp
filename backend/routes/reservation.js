const express = require("express");
const router = express.Router();
const reservations = require("../controller/reservation");
const checkAuth = require("../middleware/check-auth");

router
  .route("/")
  .get(reservations.index)
  .post(
    checkAuth,
    reservations.confirmReservationsNotExceeded,
    reservations.add
  );

router.route("/user/:userId").get(reservations.findReservationsByUserId);

router.route("/book/:bookId").get(reservations.findReservationsByBookId);

module.exports = router;
