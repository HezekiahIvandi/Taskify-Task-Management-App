const mongoose = require("mongoose");
const { updateContactName } = require("./contactController");
const renderProfile = async (req, res) => {
  res.render("profile.ejs", {
    title: "Profile",
    css: "css/profile.css",
    js: "js/profile.js",
    layout: "mainLayout.ejs",
    username: req.isAuthenticated() ? req.user.name : "username",
    photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
    email: req.isAuthenticated() ? req.user.email : "",
  });
};

// Mengubah username user
const changeUsername = async (req, res) => {
  try {
    const oldUsername = req.user.name;
    const newUsername = req.body;
    const user = mongoose.connection.db.collection("users");
    // Mengubah username user berdasarkan username sekarang
    await user.updateOne({ name: oldUsername }, { $set: newUsername });
    //Mengubah username pada contact
    await updateContactName(oldUsername, newUsername.name);
    // Mengarahkan kembali ke halaman profile setelah mengganti username
    res.redirect("/profile");
  } catch (err) {
    // Jika terjadi kesalahan akan mengirimkan error
    console.error(`Error updating task: ${err}`);
    res
      .status(500)
      .send(`An error occurred while updating the task: ${err.message}`);
  }
};

const changeEmail = async (req, res) => {
  try {
    const newEmail = req.body;
    console.log(newEmail);
    const user = mongoose.connection.db.collection("users");
    // Mengubah email user berdasarkan username sekarang
    await user.updateOne({ name: req.user.name }, { $set: newEmail });
    // Mengarahkan kembali ke halaman profile setelah mengganti username
    res.redirect("/profile");
  } catch (err) {
    // Jika terjadi kesalahan akan mengirimkan error
    console.error(`Error updating task: ${err}`);
    res
      .status(500)
      .send(`An error occurred while updating the task: ${err.message}`);
  }
};

module.exports = {
  renderProfile,
  changeUsername,
  changeEmail,
};
