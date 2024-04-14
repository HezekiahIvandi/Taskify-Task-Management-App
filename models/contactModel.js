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
  name: [
    {
      type: String,
      required: true,
    },
  ],
  latestChat: {
    type: String,
    default: "",
    set: function (value) {
      // Define the maximum length you want to allow
      const maxLength = 30;

      // Trim the value to the maximum length
      const trimmedValue =
        value.length > maxLength
          ? value.substring(0, maxLength) + "..."
          : value;

      return trimmedValue;
    },
  },
  groupStat: {
    type: String,
    default: "Online",
  },
  chats: [chatSchema],
});

module.exports = mongoose.model("Contact", contactSchema);
