const express = require("express");
const router = express.Router();
const ContactSchema = require("../models/contactModel");

//inisialisasi page chat
router.get("/chat", async (req, res) => {
  const currentUser = "Hezekiah";
  const contacts = await ContactSchema.find();
  const chatDate = "Today";
  const messagePlaceholder = "Type message here!";
  res.render("chat.ejs", {
    title: "Conversations",
    css: "css/chat.css",
    js: "js/chat.js",
    layout: "mainLayout.ejs",
    contacts: contacts,
    chatDate: chatDate,
    messagePlaceholder: messagePlaceholder,
    currentUser: currentUser,
  });
});

//read all contacts
router.get("/chat/get", async (req, res) => {
  try {
    ContactSchema.find()
      .then((contacts) => {
        console.log(contacts);
        res.status(200).json({ contacts: contacts });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to get contacts" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to get contacts" });
  }
});
//read single contact
router.get("/chat/get/:id", async (req, res) => {
  try {
    const id = req.params.id;
    ContactSchema.findById(id)
      .then((contact) => {
        console.log(contact);
        res.status(200).json({ contact: contact });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to get the contact" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to get the contact" });
  }
});
//search contacts
router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    console.log(searchTerm);
    const searchRegex = new RegExp(searchTerm, "i");
    await ContactSchema.find({
      $or: [{ name: searchRegex }],
    })
      .then((contacts) => {
        console.log(contacts);
        res.status(200).json({ contacts: contacts });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to find contacts" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "No matching records found" });
  }
});
//inserts
router.post("/chat/add", async (req, res) => {
  try {
    const newContact = new ContactSchema(req.body);
    await newContact
      .save()
      .then((savedContact) => {
        console.log(savedContact);
        res.status(201).json({ msg: "Contact successfully saved" });
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000 && err.keyPattern.name) {
          res.status(500).json({ msg: "Contact with this user already exist" });
        } else {
          res.status(500).json({ msg: "Unable to add new contact" });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to add new contact" });
  }
});
//update
router.put("/chat/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedContact = req.body;
    await ContactSchema.findOneAndUpdate({ _id: id }, updatedContact, {
      new: true,
    })
      .then((updatedContact) => {
        console.log(updatedContact);
        res.status(200).json({
          msg: "Contact successfully updated",
          contact: updatedContact,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to update the contact" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to update the contact" });
  }
});
module.exports = router;
