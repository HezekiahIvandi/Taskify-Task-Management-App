const express = require("express");
const router = express.Router();
const { renderDashboard } = require("../controller/adminController");
router.get("/dashboard", renderDashboard);

module.exports = router;
