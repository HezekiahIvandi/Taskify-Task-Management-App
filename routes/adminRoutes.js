const express = require("express");
const router = express.Router();
const {
  renderDashboard,
  deleteUserById,
  getAllUsers,
  getPagination,
  renderEditHome,
} = require("../controller/adminController");
router.get("/dashboard", renderDashboard);
router.get("/edit-home", renderEditHome);
router.get("/users/get", getAllUsers);
router.get("/dashboard/users", getPagination);
router.delete("/dashboard/delete-user/:id", deleteUserById);
module.exports = router;
