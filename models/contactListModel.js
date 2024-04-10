const mongoose = require("mongoose");
const ContactSchema = require("../models/contactModel");
const contactListSchema = new mongoose.Schema({
  contactListOwnerid: {
    type: Number,
    required: true,
  },
  contactList: [ContactSchema],
});

module.exports = mongoose.model("ContactList", contactListSchema);
