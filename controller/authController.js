const bcrypt = require("bcryptjs");
const crypto = require('node:crypto');
const passport = require("passport");
const User = require("../models/User");
const { contactListInit } = require("../controller/contactListController");
const sendEmail = require("../utils/email");

// Function menampilkan halaman login
const renderLogin = async (req, res) => {
  res.render("login.ejs", {
    title: "Login",
    css: "css/login.css",
    js: "js/login.js",
    layout: "mainLayout.ejs",
    username: req.isAuthenticated() ? req.user.name : "username",
    photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
  });
};

// Function menampilkan halaman register
const renderRegister = async (req, res) => {
  res.render("register.ejs", {
    title: "Register",
    css: "css/register.css",
    js: "js/register.js",
    layout: "mainLayout.ejs",
    username: req.isAuthenticated() ? req.user.name : "username",
    photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
  });
};

// Function Register User
const registerUser = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //cek required
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Input All The Data" });
  }

  //password
  if (password !== password2) {
    errors.push({ msg: "Password Is Different" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      title: "Register",
      css: "css/register.css",
      js: "js/register.js",
      layout: "mainLayout.ejs",
    });
  } else {
    // Validasi user pada database
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // Apabila user dengan email sama sudah ada
        errors.push({ msg: "Email Already Registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
          title: "Register",
          css: "css/register.css",
          js: "js/register.js",
          layout: "mainLayout.ejs",
        });
      } else {
        User.findOne({ name: name }).then((user) => {
          if (user) {
            // Apabila user dengan username sama sudah ada
            errors.push({ msg: "Username Has Been Used" });
            res.render("register", {
              errors,
              name,
              email,
              password,
              password2,
              title: "Register",
              css: "css/register.css",
              js: "js/register.js",
              layout: "mainLayout.ejs",
            });
          } else {
            const newUser = new User({
              name,
              email,
              password,
            });
            //hash password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                //set password jadi hash
                newUser.password = hash;

                //simpan user
                newUser
                  .save()
                  .then((user) => {
                    req.flash("success_msg", "Register Successful, Please Login");

                    //inisialisasi contact list
                    const userData = {
                      contactListOwnerid: user._id,
                      savedContactsId: [],
                    };
                    contactListInit(userData, res);

                    res.redirect("/login");
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        })
      }
    });
  }
};

// Function Login
const loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error_msg", info.message);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.user = { name: user.name }; // Store user's name in session
      return res.redirect("/project");
    });
  })(req, res, next);
};

// Function Logout
const logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Log Out Successful!");
    res.redirect("/login");
  });
};

// Function forgot password
const forgotPassword = async (req, res, next) => {
  // Mencari user berdasarkan email;
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next();
  }

  // Generasi token untuk reset password yang random
  const resetToken = await user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Mengirimkan token ke email user
  const resetUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
  const message = `We have received a password reset request. Please use the link below to reset your pasword\n\n${resetUrl}\n\nThis link will expire in 10 minutes`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset request received',
      message: message
    });

    res.status(200).json({
      status: "success",
      message: "password reset link send to the user email"
    })
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(err);
  }

}

// Function untuk reset password
const resetPassword = async (req, res, next) => {
  console.log(req.params.token);
  // Mencari user dengan token reset password yang sesuai
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpire: { $gt: Date.now() } });
  if (!user) {
    next();
  }

  // Reset password user
  // Hasing password baru
  new_password = req.body.password;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(new_password, salt, (err, hash) => {
      // Mengubah password user menjadi hash
      user.password = hash;
      user.save();
    });
  });
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;

  await user.save();

  // Redirect user ke login setelah reset password
  res.redirect("/login");
}


module.exports = {
  renderLogin,
  renderRegister,
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
};
