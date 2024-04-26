const express = require("express");

const renderDashboard = async (req, res) => {
  const currentUser = req.user.name;
  const currentUserPfp = req.user.photoUrl;
  res.render("dashboard.ejs", {
    title: "Dashboard",
    css: "css/dashboard.css",
    js: "js/dashboard.js",
    layout: "mainLayout.ejs",
    username: currentUser,
    photoUrl: currentUserPfp,
  });
};

module.exports = { renderDashboard };
