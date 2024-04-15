const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const {
  renderChatPage,
  getAllChatData,
  getOneContactById,
  createNewContact,
  searchUser,
  updateChats,
  deleteContact,
} = require("../controller/contactController");

//inisialisasi page chat
router.get("/chat", ensureAuthenticated, renderChatPage);
//read all contacts
router.get("/chat/get", getAllChatData);
//read single contact
router.get("/chat/get/:id", getOneContactById);
//search contacts
router.get("/search", searchUser);
//inserts
router.post("/chat/add", createNewContact);
//update
router.put("/chat/update/:id", updateChats);
//delete
router.delete("/chat/delete/:id", deleteContact);
module.exports = router;
