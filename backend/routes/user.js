const express = require("express");
const router = express.Router();
const users = require("../controller/user");

router.route("/").get(users.index).delete(users.deleteUser);
router.route("/verify/:token").get(users.verify);

router.route("/login").post(users.login);

router.route("/signup").post(users.add);

router.route("/id").get(users.findUser);

module.exports = router;
