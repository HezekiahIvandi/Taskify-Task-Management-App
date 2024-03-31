const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/projectModel');

router.get("/project", async (req, res) => {
  try {
    const client = await mongoose.connection.getClient(); // Mendapatkan instance MongoClient

    // Dapatkan data dari masing-masing koleksi
    const database = client.db('task-database');
    const tasksToDoCollection = database.collection('Task To Do');
    const onGoingCollection = database.collection('On Going');
    const needsReviewCollection = database.collection('Needs Review');
    const doneCollection = database.collection('Done');

    // Ambil data dari masing-masing koleksi
    const tasksToDo = await tasksToDoCollection.find({}).toArray();
    const onGoing = await onGoingCollection.find({}).toArray();
    const needsReview = await needsReviewCollection.find({}).toArray();
    const done = await doneCollection.find({}).toArray();

    console.log('Tasks To Do:', tasksToDo);
    console.log('On Going:', onGoing);
    console.log('Needs Review:', needsReview);
    console.log('Done:', done);

    // Buat struktur data yang sesuai dengan tampilan Anda
    const columns = [
      { title: "Task To Do 📝", tasks: tasksToDo },
      { title: "On Going ⏳", tasks: onGoing },
      { title: "Needs Review 🔄", tasks: needsReview },
      { title: "Done 💯", tasks: done }
    ];

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

router.post("/project", async (req, res) => {
  try {
    const { title, tag, description, date, comments, owner } = req.body; // Ambil data dari body permintaan

    const client = await mongoose.connection.getClient(); // Dapatkan instance MongoClient
    const database = client.db('task-database');

    console.log(`pertama ${title}`);

    // Tentukan koleksi berdasarkan title yang diberikan
    let collectionName;
    switch (title) {
      case "Task To Do":
        collectionName = "Task To Do";
        break;
      case "On Going":
        collectionName = "On Going";
        break;
      case "Needs Review":
        collectionName = "Needs Review";
        break;
      case "Done":
        collectionName = "Done";
        break;
      default:
        throw new Error("Title yang diberikan tidak valid");
    }

    // Dapatkan koleksi yang sesuai
    const collection = database.collection(collectionName);

    console.log(`kedua${title}`);

    // Masukkan tugas baru ke dalam koleksi yang sesuai
    await collection.insertOne({ 
      title,
      tag,
      description,
      date,
      comments,
      owner
    });

    // Kirim respons sukses
    res.status(201).send(`Data berhasil ditambahkan ke dalam koleksi '${collectionName}'`);
  } catch (error) {
    console.error("Error saat menambahkan data ke dalam koleksi:", error);
    res.status(500).send("Terjadi kesalahan saat menambahkan data ke dalam koleksi");
  }
});


module.exports = router;
