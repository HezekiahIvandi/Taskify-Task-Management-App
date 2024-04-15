const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { contactListInit } = require("../controller/contactListController");
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
    //validasi oke lanjut database
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //usernya ada
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

module.exports = {
  renderLogin,
  renderRegister,
  registerUser,
  loginUser,
  logoutUser,
};
