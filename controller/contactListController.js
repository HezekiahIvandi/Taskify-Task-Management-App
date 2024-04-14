const express = require("express");
const ContactListSchema = require("../models/contactListModel"); // Import ContactList model
//Inisialisasi contact list ketika user register
const contactListInit = async (registeredUser, res) => {
  try {
    const newContactList = new ContactListSchema(registeredUser);
    const savedContact = await newContactList.save();
    console.log(savedContact);
  } catch (err) {
    console.log(err);
    if (err.code === 11000 && err.keyPattern.name) {
      res.status(500).json({ msg: "Contact with this user already exists" });
    } else {
      res.status(500).json({ msg: "Unable to initialize new contactList" });
    }
  }
};

//update savedContactsId list
const updateSavedContactsId = async (userId, contactIdToAdd) => {
  try {
    // Find the contact list for the given userId
    const contactList = await ContactListSchema.findOne({
      contactListOwnerid: userId,
    });

    // Add the new contactIdToAdd to the savedContactsId array
    contactList.savedContactsId.push(contactIdToAdd);

    // Save the updated contact list
    await contactList.save();

    return { success: true };
  } catch (err) {
    throw new Error("Unable to update saved contacts data");
  }
};

//remove a savedContactId
const deleteSavedContactId = async (contactIdToDelete) => {
  try {
    // Update all documents in ContactListSchema by removing contactIdToDelete from savedContactsId arrays
    await ContactListSchema.updateMany(
      { savedContactsId: { $in: [contactIdToDelete] } },
      { $pull: { savedContactsId: contactIdToDelete } }
    );

    return { success: true };
  } catch (err) {
    throw new Error("Unable to delete saved contact ID across documents");
  }
};

module.exports = {
  contactListInit,
  updateSavedContactsId,
  deleteSavedContactId,
};
