const express = require("express");

const renderDashboard = async (req, res) => {
  res.render("dashboard.ejs", {
    title: "Dashboard",
    css: "css/dashboard.css",
    js: "js/dashboard.js",
    layout: "mainLayout.ejs",
  });
};

module.exports = { renderDashboard };
