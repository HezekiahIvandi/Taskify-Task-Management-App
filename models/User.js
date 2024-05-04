const mongoose = require('mongoose');
const crypto = require('node:crypto');

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
  passwordResetToken: String,
  passwordResetTokenExpire: Date
});

// Membuat token untuk reset password
User.methods.createResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  console.log(resetToken, this.passwordResetToken);
  return resetToken;
}

module.exports = mongoose.model('User', User);
