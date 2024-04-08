const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { ensureNotAuthenticated } = require("../config/auth");
const { renderLogin, renderRegister, registerUser, loginUser, logoutUser } = require("../controller/authController");

// Menampilkan Halaman Login
router.get("/login", ensureNotAuthenticated, renderLogin);
// Menampilakn Halaman Register
router.get("/register", ensureNotAuthenticated, renderRegister);
// Handling Register User
router.post("/register", ensureNotAuthenticated, registerUser);
// Handling Login User
router.post("/login", ensureNotAuthenticated, loginUser);
// Handling Logout User
router.get("/logout", logoutUser);

module.exports = router;
