const express = require("express");
const ContactSchema = require("../models/contactModel"); // Import Contact model
const UserSchema = require("../models/User");
const ContactListSchema = require("../models/contactListModel");
const {
  updateSavedContactsId,
  deleteSavedContactId,
} = require("../controller/contactListController");
const HomePageSchema = require("../models/HomepageModel");
const renderDashboard = async (req, res) => {
  const users = await UserSchema.find();
  const currentUser = req.user.name;
  const currentUserPfp = req.user.photoUrl;
  const slicedUsers = users.slice(0, 4);
  res.render("dashboard.ejs", {
    title: "Dashboard",
    css: "css/dashboard.css",
    js: "js/dashboard.js",
    layout: "mainLayout.ejs",
    username: currentUser,
    photoUrl: currentUserPfp,
    users: slicedUsers,
  });
};

const renderEditHome = async (req, res) => {
  const currentUser = req.user.name;
  const currentUserPfp = req.user.photoUrl;
  res.render("editHome.ejs", {
    title: "Edit home",
    css: "css/editHome.css",
    js: "js/editHome.js",
    layout: "mainLayout.ejs",
    username: currentUser,
    photoUrl: currentUserPfp,
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

const getPagination = async (req, res) => {
  const itemsPerPage = 4;
  console.log(itemsPerPage);
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1; // Get the current page number from the query string, default to 1
    console.log(page);
    const startIndex = (page - 1) * itemsPerPage; // Calculate the starting index for the current page
    const endIndex = startIndex + itemsPerPage; // Calculate the ending index for the current page

    const users = await UserSchema.find(); // Fetch all users from the database

    // Slice the users array to get the subset for the current page
    const slicedUsers = users.slice(startIndex, endIndex);

    // pass the users
    res.status(200).json({ users: slicedUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ msg: "Unable to get users" });
  }
};

const getHome = async (req, res) => {
  try {
    const homepageData = await HomePageSchema.find();
    res.status(200).json({ homepage: homepageData });
  } catch (err) {
    console.error("Error fetching hp:", err);
    res.status(500).json({ msg: "Unable to get hp" });
  }
};

const updateChangingText = async (req, res) => {
  const { newChangingText } = req.body;
  console.log("halo", newChangingText);
  try {
    const updatedHomepage = await HomePageSchema.findOneAndUpdate(
      {},
      { ChangingText: newChangingText },
      { new: true }
    );
    console.log("Updated ChangingText:", updatedHomepage.ChangingText);
    res.status(200).json({ message: "ChangingText updated successfully" });
  } catch (err) {
    console.error("Error updating ChangingText:", err);
    res.status(500).json({ error: "Error updating ChangingText" });
  }
};

const updateMainTitleDesc = async (req, res) => {
  const { newDesc } = req.body;
  try {
    const updatedHomepage = await HomePageSchema.findOneAndUpdate(
      {},
      { mainTitleDesc: newDesc },
      { new: true }
    );
    console.log("Updated mainTitleDesc:", updatedHomepage.newDesc);
    res.status(200).json({ message: "mainTitleDesc updated successfully" });
  } catch (err) {
    console.error("Error updating mainTitleDesc:", err);
    res.status(500).json({ error: "Error updating mainTitleDesc" });
  }
};

const updateFeaturesInfo = async (req, res) => {
  const { newInfo } = req.body;
  try {
    const updatedHomepage = await HomePageSchema.findOneAndUpdate(
      {},
      { featuresInfo: newInfo },
      { new: true }
    );
    console.log("Updated featuresInfo:", updatedHomepage.newInfo);
    res.status(200).json({ message: "featuresInfo updated successfully" });
  } catch (err) {
    console.error("Error updating featuresInfo:", err);
    res.status(500).json({ error: "Error updating featuresInfo" });
  }
};
module.exports = {
  renderDashboard,
  deleteUserById,
  getAllUsers,
  getPagination,
  renderEditHome,
  getHome,
  updateChangingText,
  updateMainTitleDesc,
  updateFeaturesInfo,
};
