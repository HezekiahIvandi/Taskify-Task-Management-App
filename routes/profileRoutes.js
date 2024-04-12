const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/profile", (req, res) => {
    res.render("profile.ejs", {
        title: "Profile",
        css: "css/profile.css",
        js: "js/profile.js",
        layout: "mainLayout.ejs",
        username: req.isAuthenticated() ? req.user.name : "username",
        photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
        email: req.isAuthenticated() ? req.user.email : "",
    });
});

module.exports = router;