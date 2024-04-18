const express = require("express");
const {
  renderProfile,
  changeUsername,
  changeEmail,
} = require("../controller/profileController");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Menampilkan halaman profile
router.get("/profile", ensureAuthenticated, renderProfile);

// Mengubah username user
router.post("/edit-username", changeUsername);

// Mengubah email user
router.post("/edit-email", changeEmail);

module.exports = router;
