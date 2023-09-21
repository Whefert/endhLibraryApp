const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //check if token is attached to the request
    const token = req.headers.authorization.split(" ")[1];
    //validate the token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!", error: error.message });
  }
};
