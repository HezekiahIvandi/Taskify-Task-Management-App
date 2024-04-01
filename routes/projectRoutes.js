// Import modul yang dibutuhkan
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Membuat objek router menggunakan Router()
const router = express.Router();

// Handling Request GET pada rute "/project"
// Dapat dianalogikan dengan operasi Read dalam CRUD
// Server meminta data dari MongoDB untuk disajikan di sisi client
router.get("/project", async (req, res) => {
  try {
    // Mengakses objek database MongoDB
    const db = mongoose.connection.db;

    // Mengakses collection dari database
    const tasksToDoCollection = db.collection("Task To Do");
    const onGoingCollection = db.collection("On Going");
    const needsReviewCollection = db.collection("Needs Review");
    const doneCollection = db.collection("Done");

    // Mengambil data (task card) dari masing-masing collection menggunakan metode find({})
    const tasksToDo = await tasksToDoCollection.find({}).toArray();
    const onGoing = await onGoingCollection.find({}).toArray();
    const needsReview = await needsReviewCollection.find({}).toArray();
    const done = await doneCollection.find({}).toArray();

    // Data yang telah diambil dari MongoDB dikemas untuk dikirimkan sebagai respons
    const columns = [
      { title: "Task To Do 📝", tasks: tasksToDo },
      { title: "On Going ⏳", tasks: onGoing },
      { title: "Needs Review 🔎", tasks: needsReview },
      { title: "Done 💯", tasks: done },
    ];
    let progressData = [
      { tag: "Perencanaan", current: 3, total: 4 },
      { tag: "Desain UI/UX", current: 1, total: 3 },
      { tag: "Frontend", current: 1, total: 2 },
      { tag: "Backend", current: 0, total: 3 },
      { tag: "Testing", current: 0, total: 2 },
      { tag: "Deployment", current: 0, total: 2 },
      { tag: "Maintenance", current: 0, total: 2 },
    ]; // Data ini masih diinisialisasikan secara manual

    // Merender halaman HTML menggunakan EJS dan mengirimkan hasil ke client
    res.render("project.ejs", {
      title: "Projects",
      css: "css/project.css",
      js: "js/project.js",
      layout: "mainLayout.ejs",
      columns: columns,
      progressData: progressData,
    });

    // Error handling untuk mencetak pesan kesalahan dan detailnya ke konsol
    // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
  } catch (error) {
    console.error("Error saat mengambil data dari MongoDB:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data dari MongoDB");
  }
});

// Handling Request POST pada rute "/project"
// Dapat dianalogikan dengan operasi Create dalam CRUD
// Client mengirimkan data ke Server untuk disimpan dalam MongoDB
router.post("/project", async (req, res) => {
  try {
    // Mengakses objek database MongoDB
    const db = mongoose.connection.db;

    // Mengambil nilai-nilai yang dimasukkan client melalui form dengan method POST menggunakan objek req.body
    const { title, tag, description, date, comments, owner } = req.body;

    // Menentukan nama collection berdasarkan title yang dimasukkan client
    let collectionName;
    switch (title) {
      case "Task To Do 📝":
        collectionName = "Task To Do";
        break;
      case "On Going ⏳":
        collectionName = "On Going";
        break;
      case "Needs Review 🔎":
        collectionName = "Needs Review";
        break;
      case "Done 💯":
        collectionName = "Done";
        break;
      default:
        throw new Error("Title yang diberikan tidak valid");
    }

    // Mengakses collection dari database
    const collection = db.collection(collectionName);

    // Menambahkan satu data (task) baru ke dalam collection yang sesuai menggunakan insertOne()
    await collection.insertOne({
      title,
      tag,
      description,
      date,
      comments,
      owner,
    });

    // Server mengirimkan respons HTTP dengan status code 201, yang menunjukkan bahwa permintaan telah berhasil dilakukan
    res
      .status(201)
      .send(`Data berhasil ditambahkan ke dalam koleksi '${collectionName}'`);

    // Error handling untuk mencetak pesan kesalahan dan detailnya ke konsol
    // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
  } catch (error) {
    console.error("Error saat menambahkan data ke MongoDB:", error);
    res.status(500).send("Terjadi kesalahan saat menambahkan data ke MongoDB");
  }
});

// Handling Request DELETE pada rute "/delete-task"
// Dapat dianalogikan dengan operasi Delete dalam CRUD
// Client mengirimkan data ke Server untuk dihapus dari MongoDB
router.post("/delete-task/:title/:id", async (req, res) => {
  try {
    // Mengakses objek database MongoDB
    const title = req.params.title;
    let collectionName;
    switch (title) {
      case "Task To Do 📝":
        collectionName = "Task To Do";
        break;
      case "On Going ⏳":
        collectionName = "On Going";
        break;
      case "Needs Review 🔎":
        collectionName = "Needs Review";
        break;
      case "Done 💯":
        collectionName = "Done";
        break;
      default:
        throw new Error("Title yang diberikan tidak valid");
    }
    console.log(collectionName);
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const id = new mongoose.Types.ObjectId(req.params.id);
    // Menghapus satu data (task) dari collection berdasarkan deskripsi yang diberikan menggunakan deleteOne()
    const result = await collection.deleteOne({
      _id: id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.redirect("/project");
  } catch (error) {
    console.error("Error deleting data from MongoDB:", error);
    res.status(500).send("An error occurred while deleting data from MongoDB");
  }
});

// Handling Request UPDATE pada rute "/update-task"
// Dapat dianalogikan dengan operasi Update dalam CRUD
// Client mengirimkan data ke Server untuk diperbaharui dari MongoDB
// Route untuk meng-handle permintaan PUT

// Mengekspor objek router
module.exports = router;
