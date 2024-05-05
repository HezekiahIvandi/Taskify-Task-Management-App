const express = require("express");
const ContactSchema = require("../models/contactModel"); // Import Contact model
const UserSchema = require("../models/User");
const ContactListSchema = require("../models/contactListModel");
const {
  updateSavedContactsId,
  deleteSavedContactId,
} = require("../controller/contactListController");

const renderDashboard = async (req, res) => {
  const users = await UserSchema.find();
  const currentUser = req.user.name;
  const currentUserPfp = req.user.photoUrl;
  res.render("dashboard.ejs", {
    title: "Dashboard",
    css: "css/dashboard.css",
    js: "js/dashboard.js",
    layout: "mainLayout.ejs",
    username: currentUser,
    photoUrl: currentUserPfp,
    users: users,
    isAdmin: req.isAuthenticated() ? req.user.isAdmin : false,
  });
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;
  console.log("id is ", id);
  try {
    // Find the user by ID and remove it from the database
    await UserSchema.deleteOne({ _id: id })
      .then(() => {
        res.status(200).json({
          msg: "Contact successfully deleted",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to delete the contact" });
      });
  } catch (err) {
    // Handle any errors that occurred during the delete operation
    console.error("Error deleting user:", err);
    throw err;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersData = await UserSchema.find();
    res.status(200).json({ users: usersData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to get users" });
  }
};

module.exports = { renderDashboard, deleteUserById, getAllUsers };
