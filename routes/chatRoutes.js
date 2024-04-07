const express = require("express");
const router = express.Router();
const ContactSchema = require("../models/contactModel");
const {
  renderChatPage,
  getAllChatData,
  getOneContactById,
  createNewContact,
  searchContact,
  updateChats,
  deleteContact,
} = require("../controller/chatController");

//inisialisasi page chat
router.get("/chat", renderChatPage);
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
//delete
router.delete("/chat/delete/:id", deleteContact);
module.exports = router;
