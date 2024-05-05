const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Homepage", HomepageSchema);
