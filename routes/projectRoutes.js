const express = require("express");
const router = express.Router();
const Task = require('../models/projectModel');

router.get("/project", async (req, res) => {
  try {
    // Ambil semua tasks dari MongoDB
    const tasks = await Task.find({});

    // Buat struktur data yang sesuai dengan tampilan Anda
    let columns = tasks.map(task => ({
      title: task.title,
      tasks: task.tasks
    }));

    let progressData = [
      { tag: "Perencanaan", current: 3, total: 4 },
      { tag: "Desain UI/UX", current: 1, total: 3 },
      { tag: "Frontend", current: 1, total: 2 },
      { tag: "Backend", current: 0, total: 3 },
      { tag: "Testing", current: 0, total: 2 },
      { tag: "Deployment", current: 0, total: 2 },
      { tag: "Maintenance", current: 0, total: 2 },
    ];

    // Kirim respons dengan data tasks yang diambil dari MongoDB
    res.render("project.ejs", {
      title: "Projects",
      css: "css/project.css",
      js: "js/project.js",
      layout: "mainLayout.ejs",
      columns: columns,
      progressData: progressData,
    });
  } catch (error) {
    console.error("Error saat mengambil data dari MongoDB:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data dari MongoDB");
  }
});

module.exports = router;