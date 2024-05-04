const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { ensureNotAuthenticated, ensureAuthenticated } = require("../config/auth");
const { renderLogin, renderRegister, registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require("../controller/authController");

// Menampilkan Halaman Login
router.get("/login", ensureNotAuthenticated, renderLogin);
// Menampilakn Halaman Register
router.get("/register", ensureNotAuthenticated, renderRegister);
// Handling Register User
router.post("/register", ensureNotAuthenticated, registerUser);
// Handling Login User
router.post("/login", ensureNotAuthenticated, loginUser);
// Handling Logout User
router.get("/logout", ensureAuthenticated, logoutUser);
// Handling Forgot Password
router.post("/forgot", forgotPassword);
// Handling Reset Password
router.patch("/reset/:token", resetPassword)

module.exports = router;
