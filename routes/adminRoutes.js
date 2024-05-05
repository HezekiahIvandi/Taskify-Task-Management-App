const express = require("express");
const router = express.Router();
const {
  renderDashboard,
  deleteUserById,
  getAllUsers,
  getPagination,
  renderEditHome,
  getHome,
  updateChangingText,
  updateMainTitleDesc,
  updateFeaturesInfo,
} = require("../controller/adminController");
router.get("/dashboard", renderDashboard);
router.get("/edit-home", renderEditHome);
router.get("/users/get", getAllUsers);
router.get("/dashboard/users", getPagination);
router.get("/home/get", getHome);
router.delete("/dashboard/delete-user/:id", deleteUserById);
router.put("/home/update/ChangingText", updateChangingText);
router.put("/home/update/MainTitleDesc", updateMainTitleDesc);
router.put("/home/update/FeaturesInfo", updateFeaturesInfo);
module.exports = router;
