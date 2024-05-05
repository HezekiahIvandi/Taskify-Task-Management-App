const mongoose = require("mongoose");

const HomepageSchema = new mongoose.Schema({
  ChangingText: {
    type: [String],
    default: ["easily", "efficiently", "neatly", "quickly", "effortlessly"],
  },
  mainTitleDesc: {
    type: String,
    default:
      "Become focused, organized, and calm with Taskify The world's #1 task manager app",
  },
  featuresInfo: {
    type: String,
    default: "1+ million users trust Taskify for their tasks",
  },
});

module.exports = mongoose.model("Homepage", HomepageSchema, "homepage");
