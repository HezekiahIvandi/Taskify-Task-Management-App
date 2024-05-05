const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Home",
    css: "css/home.css",
    js: "js/home.js",
    layout: "mainLayout.ejs",
    username: req.isAuthenticated() ? req.user.name : "username",
    photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
    isAdmin: req.isAuthenticated() ? req.user.isAdmin : false,
  });
});
module.exports = router;
