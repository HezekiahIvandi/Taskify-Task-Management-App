const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: "assets/Pfp.png",
    },
  },
  message: {
    type: String,
    default: "",
  },
});

const contactSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: "assets/Pfp.png",
  },
  name: {
    type: String,
    unique: [true, "This contact's name already exists"],
    required: true,
  },
  latestChat: {
    type: String,
    default: "",
  },
  groupStat: {
    type: String,
    default: "Online",
  },
  chats: [chatSchema],
});

module.exports = mongoose.model("Contact", contactSchema);
