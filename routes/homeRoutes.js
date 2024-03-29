const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Home",
    css: "css/home.css",
    js: "js/home.js",
    layout: "mainLayout.ejs",
  });
});
module.exports = router;
