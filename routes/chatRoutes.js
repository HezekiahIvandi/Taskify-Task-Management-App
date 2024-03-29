const express = require("express");
const router = express.Router();

router.get("/chat", (req, res) => {
  // Contoh data contacts
  const contacts = [
    {
      id: 1,
      isSelected: true,
      imageUrl: "assets/Pfp.png",
      name: "Taskify development team",
      latestChat: "Morning!",
    },
    {
      id: 2,
      isSelected: false,
      imageUrl: "assets/Pfp.png",
      name: "Vie Huang",
      latestChat: "Hello there!",
    },
    {
      id: 3,
      isSelected: false,
      imageUrl: "assets/Pfp.png",
      name: "Hezekiah Ivandi",
      latestChat: "How are you?",
    },
    {
      id: 4,
      isSelected: false,
      imageUrl: "assets/Pfp.png",
      name: "Marchella Angelina",
      latestChat: "I'm doing well, thank you!",
    },
  ];

  const chatHeader = {
    imageUrl: "assets/Pfp.png",
    title: "Taskify development team",
    groupStat: "3 members, 0 online",
  };

  const chatDate = "Today";

  const chats = [
    { sender: { imageUrl: "assets/Pfp.png" }, message: "Hello there!" },
    { sender: { imageUrl: "assets/Pfp.png" }, message: "How are you?" },
    {
      sender: { imageUrl: "assets/Pfp.png" },
      message: "I'm doing well, thank you!",
    },
  ];

  const messagePlaceholder = "Type message here!";

  res.render("chat.ejs", {
    title: "Conversations",
    css: "css/chat.css",
    js: "js/chat.js",
    layout: "mainLayout.ejs",
    contacts: contacts,
    chatHeader: chatHeader,
    chatDate: chatDate,
    chats: chats,
    messagePlaceholder: messagePlaceholder,
  });
});

module.exports = router;
