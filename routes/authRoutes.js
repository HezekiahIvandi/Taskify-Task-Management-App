const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
    css: "css/login.css",
    js: "js/login.js",
    layout: "mainLayout.ejs",
  });
});

router.get("/register", (req, res) => {
  res.render("register.ejs", {
    title: "Register",
    css: "css/register.css",
    js: "js/register.js",
    layout: "mainLayout.ejs",
  });
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  // console.log(req.body);
  // res.send("hello");
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
                req.flash(
                  "success_msg",
                  "Register Successful, Please Login"
                );

                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//login handle
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/project",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Log Out Successful!");
  res.redirect("/login");
});
module.exports = router;
