const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    console.error(`Error change username: ${err}`);
    res
      .status(500)
      .send(`An error occurred while changing the username: ${err.message}`);
  }
};

// Mengubah email user
const changeEmail = async (req, res) => {
  try {
    const newEmail = req.body;
    console.log(newEmail);
    const user = mongoose.connection.db.collection("users");
    // Mengubah email user berdasarkan username sekarang
    await user.updateOne({ name: req.user.name }, { $set: newEmail });
    // Mengarahkan kembali ke halaman profile setelah mengganti email
    res.redirect("/profile");
  } catch (err) {
    // Jika terjadi kesalahan akan mengirimkan error
    console.error(`Error change email: ${err}`);
    res
      .status(500)
      .send(`An error occurred while changing the email: ${err.message}`);
  }
};

// Mengubah password user dengan menggunakan password lama
const changePassword = async (req, res) => {
  let {old_password, new_password} = req.body;
  const user = mongoose.connection.db.collection("users");
  // Membandingkan password yang dimasukan sesuai dengan password di database
  try {
    bcrypt.compare(old_password, req.user.password, function(err, result) {
      if (result == true) {
        // Hasing password baru user
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_password, salt, (err, hash) => {
            // Mengubah password user menjadi hash
            user.updateOne({ name: req.user.name }, { $set: {password : hash} });
          });
        });
        // Mengarahkan kembali ke halaman profile setelah sukses mengganti password
        res.redirect("/profile"); 
      }
      else {
        // Mengarahkan kembali ke halaman profile setelah gagal mengganti password
        res.redirect("/profile");
      }
    });
  } catch (err) {
    // Jika terjadi kesalahan akan mengirimkan error
    console.error(`Error change password: ${err}`);
    res
      .status(500)
      .send(`An error occurred while changing the password: ${err.message}`);
  }
  
};

module.exports = {
  renderProfile,
  changeUsername,
  changeEmail,
  changePassword,
};
