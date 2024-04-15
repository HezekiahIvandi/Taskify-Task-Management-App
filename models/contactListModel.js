const mongoose = require("mongoose");
const ContactSchema = require("../models/contactModel");
const contactListSchema = new mongoose.Schema({
  contactListOwnerid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  savedContactsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("ContactList", contactListSchema);
