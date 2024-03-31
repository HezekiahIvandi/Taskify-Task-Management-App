const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/projectModel');

const app = express();

router.get("/project", async (req, res) => {
  try {
    // Dapatkan instance database dari koneksi mongoose
    const db = mongoose.connection.db;

    // Dapatkan koleksi dari database
    const tasksToDoCollection = db.collection('Task To Do');
    const onGoingCollection = db.collection('On Going');
    const needsReviewCollection = db.collection('Needs Review');
    const doneCollection = db.collection('Done');

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
      { title: "Task To Do", tasks: tasksToDo },
      { title: "On Going", tasks: onGoing },
      { title: "Needs Review", tasks: needsReview },
      { title: "Done", tasks: done }
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

    // Dapatkan instance database dari koneksi mongoose
    const db = mongoose.connection.db;

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
    const collection = db.collection(collectionName);

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

router.delete('/delete-task', async (req, res) => {
  try {
    const collectionName = req.query.collection; // Mendapatkan nama koleksi dari permintaan
    const dataDescription = req.query.data; // Mendapatkan deskripsi data yang akan dihapus dari permintaan
    console.log(collectionName);
    console.log(dataDescription);

    // Dapatkan instance database dari koneksi mongoose
    const db = mongoose.connection.db;
    
    const collection = db.collection(collectionName);

    // Menghapus data dari koleksi berdasarkan deskripsi yang diberikan
    const result = await collection.deleteOne({ description: dataDescription });

    // Periksa apakah data berhasil dihapus
    if (result.deletedCount === 1) {
      res.send('Data deleted successfully');
    } else {
      res.send('Data not found or already deleted');
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Error deleting data');
  }
});


router.put("/update-task", async (req, res) => {
  try {
    const { title, description, updatedData } = req.body; // Ambil data dari body permintaan
    console.log(title);
    console.log(description);
    console.log(updatedData);

    // Dapatkan instance database dari koneksi mongoose
    const db = mongoose.connection.db;

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
    const collection = db.collection(collectionName);

    // Ambil data saat ini dari koleksi berdasarkan deskripsi yang diberikan
    const currentData = await collection.findOne({ description: description });

    if (!currentData) {
      throw new Error("Data tidak ditemukan");
    }

    // Gabungkan data saat ini dengan data yang diperbarui
    const newData = { ...currentData, ...updatedData };

    // Perbarui data di koleksi yang sesuai
    const result = await collection.updateOne(
      { description: description },
      { $set: newData }
    );

    // Periksa apakah data berhasil diperbarui
    if (result.modifiedCount === 1) {
      res.send(`Data di koleksi '${collectionName}' berhasil diperbarui`);
    } else {
      res.send('Data tidak ditemukan atau tidak diperbarui');
    }
  } catch (error) {
    console.error("Error saat memperbarui data:", error);
    res.status(500).send("Terjadi kesalahan saat memperbarui data");
  }
});


module.exports = router;
