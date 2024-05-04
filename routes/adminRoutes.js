const express = require("express");
const router = express.Router();
const {
  renderDashboard,
  deleteUserById,
  getAllUsers,
} = require("../controller/adminController");
router.get("/dashboard", renderDashboard);
router.get("/users/get", getAllUsers);
router.delete("/dashboard/delete-user/:id", deleteUserById);
module.exports = router;
