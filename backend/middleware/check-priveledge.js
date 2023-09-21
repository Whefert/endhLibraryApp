const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const adminConfirmed = await User.find({
      _id: req.userData.userId,
      role: "admin",
    });
    if (adminConfirmed.length == 0) {
      throw new Error("You are not authorized to complete this action");
    }
    next();
  } catch (e) {
    res.status(500).json({
      message: "You are not authorized to complete this action",
      error: e.message,
    });
  }
};
