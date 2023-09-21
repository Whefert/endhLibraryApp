const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendgrid = require("../send-grid");
// const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

//TODO: Disable this
module.exports.index = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length === 0) {
      throw new Error("No users found");
    }
    res.status(200).json({ messages: `${allUsers.length} found`, allUsers });
  } catch (error) {
    res.status(500).json({ message: error.message, users: [] });
  }
};

module.exports.verify = async (req, res, next) => {
  try {
    const newUser = await User.findOne({ emailToken: req.params.token });

    if (newUser.length === 0) {
      throw new Error("Unable to find User");
    }
    newUser.isVerified = true;
    await newUser.save();
    res
      .status(200)
      .json({ message: "User account verified succesfully", verified: true });
  } catch (error) {
    res.status(404).json({
      message: "Unable to verify user",
      verified: false,
    });
  }
};

module.exports.findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).json({ message: `User found succesfully`, user });
  } catch (error) {
    res
      .status(404)
      .json({ message: `Unable to find user, Please try again`, user: [] });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    res
      .status(200)
      .json({ message: `User ${user.name} removed succesfully`, user });
  } catch (error) {
    res
      .status(404)
      .json({ message: `Unable to find user, Please try again`, user: [] });
  }
};

module.exports.add = async (req, res, next) => {
  try {
    //check if the user email is already in the database
    const emailExists = await User.exists({
      email: req.body.email.toLowerCase(),
    });

    if (emailExists) {
      throw new Error(
        "This email is already in use. Please signup with a unique email"
      );
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      emailToken: crypto.randomBytes(64).toString("hex"),
      isVerified: false,
      password: hashedPassword,
      role: req.body.role,
    });

    // //Save the new users
    await newUser.save().catch((err) => {
      throw new Error("Unable to create new user. Please try again");
    });

    //TODO: Reenable to send email
    sendgrid.sendNewUserMessage(newUser, req.hostname);

    //TODO: Update front end so it is not expecting the User ID in the response

    //Send back to user on front end to check their email to verify their account
    res.status(200).json({
      message:
        "Thanks for registering. Please check your email to verify your account and complete registration",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. " + error.message });
  }
};

//TODO: Implement find user rentals

module.exports.login = async (req, res, next) => {
  //check if a user with the input email exists
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new Error("Incorrect username/password. Please try again");
    }

    //compare input password to hashed password in the database
    const userAuthenticated = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (userAuthenticated) {
      //if password comparison is succesful, generate a token for the user

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        //updated this from to link to ENV file
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      //Respond with the token and expiry time in seconds
      res.status(200).json({
        token,
        expiresIn: 3600,
        name: user.name.split(" ")[0],
        userRole: user.role,
      });
    } else {
      throw new Error("Incorrect username / password. Please try again");
    }
  } catch (error) {
    //TODO: Implement better error handling here
    res.status(401).json({ message: error.message });
  }
};
