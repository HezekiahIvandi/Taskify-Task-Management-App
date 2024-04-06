const express = require("express");
const { getAllTaskData, createNewTask, deleteTask, updateTask } = require("../controller/projectController");

// Membuat objek router menggunakan Router()
const router = express.Router();

// Handling Request GET pada rute "/project"
// Dapat dianalogikan dengan operasi Read dalam CRUD
// Server meminta data dari MongoDB untuk disajikan di sisi client
router.get("/project", getAllTaskData);

// Handling Request POST pada rute "/project"
// Dapat dianalogikan dengan operasi Create dalam CRUD
// Client mengirimkan data ke Server untuk disimpan dalam MongoDB
router.post("/project", createNewTask);


// Handling Request DELETE pada rute "/delete-task"
// Dapat dianalogikan dengan operasi Delete dalam CRUD
// Client mengirimkan data ke Server untuk dihapus dari MongoDB
router.post("/delete-task/:title/:id", deleteTask);

// Handling Request UPDATE pada rute "/edit-task"
// Dapat dianalogikan dengan operasi Update dalam CRUD
// Client mengirimkan data ke Server untuk diperbaharui dari MongoDB
// Route untuk meng-handle permintaan PUT
router.post("/edit-task/:title/:id", updateTask);

// Mengekspor objek router
module.exports = router;