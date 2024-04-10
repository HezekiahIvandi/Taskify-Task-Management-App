const express = require("express");
const ContactSchema = require("../models/contactModel"); // Import Contact model
const UserSchema = require("../models/User");
//Fungsi untuk read data contacts di mongoDb kemudian return data
const readContactsData = async (req, res) => {
  try {
    return await ContactSchema.find();
  } catch (err) {
    throw new Error("Unable to read contacts data");
  }
};

//Fungsi untuk get method pada /chat
const renderChatPage = async (req, res) => {
  const currentUser = req.isAuthenticated() ? req.user.name : "username"; //sementara
  const currentUserPfp = req.isAuthenticated() ? req.user.photoUrl : ""; //sementara

  const contacts = await readContactsData();
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
    username: currentUser,
    photoUrl: currentUserPfp,
  });
};

//Fungsi response untuk request get method all contact's data ke /chat/get
const getAllChatData = async (req, res) => {
  try {
    const contactsData = await readContactsData();
    res.status(200).json({ contacts: contactsData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to get contacts" });
  }
};
//Fungsi response untuk request get method sebuah contact data by id ke /chat/get/:id
const getOneContactById = async (req, res) => {
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
};

//Fungsi create new contact
const createNewContact = async (req, res) => {
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
};
//Fungsi untuk update existing chats
const updateChats = async (req, res) => {
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
};
// Fungsi untuk delete contact
const deleteContact = async (req, res) => {
  try {
    // Id contact yang akan di delete
    const id = req.params.id;
    console.log(id);
    // Menghapus contact yang mempunyai _id = id
    await ContactSchema.deleteOne({
      _id: id,
    })
      .then(() => {
        res.status(200).json({
          msg: "Contact successfully deleted",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to delete the contact" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to delete the contact" });
  }
};
//Fungsi search User
const searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    console.log(searchTerm);
    const searchRegex = new RegExp(`^${searchTerm}`, "i"); // Match emails starting with the search term
    await UserSchema.find({
      email: searchRegex,
    })
      .then((users) => {
        console.log(users);
        res.status(200).json({ users: users });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to find user" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "No matching records found" });
  }
};

module.exports = {
  renderChatPage,
  getAllChatData,
  getOneContactById,
  createNewContact,
  searchUser,
  updateChats,
  deleteContact,
};
