const express = require("express");
const router = express.Router();
const HomePageSchema = require("../models/HomepageModel");
router.get("/", async (req, res) => {
  // Retrieve the document
  let homepageData = await HomePageSchema.find();
  if (homepageData.length == 0) {
    // Create a new document (if it doesn't exist)
    const homepage = new HomePageSchema();
    await homepage.save();
    homepageData = await HomePageSchema.find();
  }
  homepageData = homepageData[0];
  console.log(homepageData);
  console.log(homepageData.length);
  res.render("index.ejs", {
    title: "Home",
    css: "css/home.css",
    js: "js/home.js",
    layout: "mainLayout.ejs",
    username: req.isAuthenticated() ? req.user.name : "username",
    photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
    homepageData: homepageData,
  });
});
module.exports = router;
