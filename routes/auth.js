const express = require("express");
const router = express.Router();
const { login, register, logout } = require("../controllers/auth");
// validators
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userLogInValidator,
} = require("../validators/auth");

router.route("/register").post(userSignupValidator, runValidation, register);
router.route("/login").post(userLogInValidator, runValidation, login);
router.route("/logout").get(logout);

module.exports = router;
