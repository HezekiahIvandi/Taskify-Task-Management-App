const mongoose = require('mongoose');

const User = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default: "assets/Pfp.png",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', User);
