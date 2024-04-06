// Import modul yang dibutuhkan
const express = require("express");
const mongoose = require("mongoose");
const TaskToDo = require("../models/TaskToDo");
const OnGoing = require("../models/OnGoing");
const NeedsReview = require("../models/NeedsReview");
const Done = require("../models/Done");

const getAllTaskData = async (req, res) => {
    try {
      // Mengakses objek database MongoDB
      const db = mongoose.connection.db;
  
      // Mengambil data dari model-model yang sesuai
      const tasksToDo = await TaskToDo.find({});
      const onGoing = await OnGoing.find({});
      const needsReview = await NeedsReview.find({});
      const done = await Done.find({});
      
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
  };

  const createNewTask = async (req, res) => {
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
      
      // Redirect ke '/project/' setelah berhasil menambahkan data
      res.redirect('/project/');
  
    } catch (error) {
      // Error handling untuk mencetak pesan kesalahan dan detailnya ke konsol
      console.error("Error saat menambahkan data ke MongoDB:", error);
      // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
      res.status(500).send("Terjadi kesalahan saat menambahkan data ke MongoDB");
    }
  };

const deleteTask = async (req, res) => {
    try {
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
  };

  const updateTask = async (req, res) => {
    try {
      const title = req.params.title;
  
      // Mengambil data yang diperbarui dari req.body
      const { tag, description, date, comments, owner } = req.body;
  
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
      
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      const id = new mongoose.Types.ObjectId(req.params.id);
      
      // Melakukan update data (task) dari collection berdasarkan deskripsi yang diberikan menggunakan updateOne()
      await collection.updateOne( 
        { _id: id }, 
        { $set: {
          tag,
          description,
          date,
          comments,
          owner,
        } });
  
      res.redirect("/project");
    } catch (error) {
      console.error("Error updating data in MongoDB:", error);
      res.status(500).send("An error occurred while updating data in MongoDB");
    }
  };

module.exports = {
    getAllTaskData, 
    createNewTask, 
    deleteTask,
    updateTask,
};