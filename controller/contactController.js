const express = require("express");
const ContactSchema = require("../models/contactModel"); // Import Contact model
const UserSchema = require("../models/User");
const ContactListSchema = require("../models/contactListModel");
const {
  updateSavedContactsId,
  deleteSavedContactId,
} = require("../controller/contactListController");

//Duplicate test
const isDuplicateNameArray = async (namesArray) => {
  // cari apakah ada contact dengan names yang sama
  const existingDocuments = await ContactSchema.find({
    name: namesArray,
  });

  // Jika ketemu return true (duplicate)
  return existingDocuments.length > 0;
};

//Fungsi untuk read data contacts di mongoDb kemudian return data
const readContactsData = async (userId) => {
  try {
    // Find the contact list for the given userId
    const contactList = await ContactListSchema.findOne({
      contactListOwnerid: userId,
    });

    // Get the savedContactsId from the contact list
    const savedContactsIds = contactList.savedContactsId;

    // Find all contacts whose _id is in the savedContactsIds array
    const contacts = await ContactSchema.find({
      _id: { $in: savedContactsIds },
    });

    return contacts;
  } catch (err) {
    throw new Error("Unable to read contacts data");
  }
};

//Fungsi untuk memproses data contacts yang sudah di read agar sesuai dengan kebutuhan
const adjustContactsData = async (currentUser, datas) => {
  try {
    // Iterate through each contact
    datas.forEach((contact) => {
      // Filter out the names that are equal to currentUser
      contact.name = contact.name.filter((name) => name !== currentUser);
    });

    return datas;
  } catch (err) {
    throw new Error("Unable to adjust contacts data");
  }
};
//Fungsi untuk get method pada /chat
const renderChatPage = async (req, res) => {
  const currentUser = req.isAuthenticated() ? req.user.name : "username";
  const currentUserPfp = req.isAuthenticated() ? req.user.photoUrl : "";
  const currentUserId = req.user._id;
  const contacts = await readContactsData(currentUserId);
  const adjustedContacts = await adjustContactsData(currentUser, contacts);
  const chatDate = "Today";
  const messagePlaceholder = "Type message here!";
  res.render("chat.ejs", {
    title: "Conversations",
    css: "css/chat.css",
    js: "js/chat.js",
    layout: "mainLayout.ejs",
    contacts: adjustedContacts,
    chatDate: chatDate,
    messagePlaceholder: messagePlaceholder,
    username: currentUser,
    photoUrl: currentUserPfp,
  });
};

//Fungsi response untuk request get method all contact's data ke /chat/get
const getAllChatData = async (req, res) => {
  try {
    const currentUser = req.user.name;
    const currentUserId = req.user._id;
    const contactsData = await readContactsData(currentUserId);
    const adjustedContacts = await adjustContactsData(
      currentUser,
      contactsData
    );
    res.status(200).json({ contacts: adjustedContacts });
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
  const currentUserId = req.user._id;
  const { name, id } = req.body;
  const contactData = {
    name: name.slice().sort(),
    id,
  };
  try {
    const newContact = new ContactSchema(contactData);
    //check apakah contact dengan name yang sama sudah ada
    if (await isDuplicateNameArray(contactData.name)) {
      return res
        .status(500)
        .json({ msg: "Contact with this user already exist" });
    }
    await newContact
      .save()
      .then((savedContact) => {
        console.log(savedContact);
        updateSavedContactsId(currentUserId, savedContact._id); //add savedContactId to current user's contactList
        updateSavedContactsId(req.body.id, savedContact._id); //add savedContactId to the added user's contactList
        res.status(201).json({ msg: "Contact successfully saved" });
      })
      .catch((err) => {
        console.log(err);

        res.status(500).json({ msg: "Unable to add new contact" });
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
  const currentUserId = req.user._id;
  try {
    // Id contact yang akan di delete
    const id = req.params.id;
    console.log(id);
    // Menghapus contact yang mempunyai _id = id
    await ContactSchema.deleteOne({
      _id: id,
    })
      .then(() => {
        deleteSavedContactId(id);
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

//Fungsi untuk update name contact
const updateContactName = async (oldName, newName) => {
  try {
    const updatedContact = await ContactSchema.findOneAndUpdate(
      { name: oldName },
      { $set: { "name.$": newName } },
      { new: true }
    );
    console.log("Contact's name is updated successfully:", updatedContact);
  } catch (error) {
    console.error("Error updating contact name:", error);
    throw new Error("Unable to update name");
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
  updateContactName,
};
