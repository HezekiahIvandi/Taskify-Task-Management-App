const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const ContactSchema = require("../models/contactModel");
const {
  renderChatPage,
  getAllChatData,
  getOneContactById,
  createNewContact,
  searchContact,
  updateChats,
} = require("../controller/chatController");

//inisialisasi page chat
router.get("/chat", ensureAuthenticated, renderChatPage);
//read all contacts
router.get("/chat/get", getAllChatData);
//read single contact
router.get("/chat/get/:id", getOneContactById);
//search contacts
router.get("/search", searchContact);
//inserts
router.post("/chat/add", createNewContact);
//update
router.put("/chat/update/:id", updateChats);
module.exports = router;
