// Import modul yang dibutuhkan
const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const { getAllTaskData, createNewTask, deleteTask, updateTask, sortTask, dragAndMoveTask} = require("../controller/projectController");

// Membuat objek router menggunakan Router()
const router = express.Router();

// Handling Request GET pada rute "/project"
// Dapat dianalogikan dengan operasi Read dalam CRUD
// Server meminta data dari MongoDB untuk disajikan di sisi client
router.get("/project",ensureAuthenticated, getAllTaskData);

// CREATE - Client mengirimkan data ke Server untuk disimpan dalam MongoDB
router.post("/project", createNewTask);

// DELETE - Client mengirimkan data ke Server untuk dihapus dari MongoDB
router.post("/delete-task/:title/:id", deleteTask);

// UPDATE - Client mengirimkan data ke Server untuk diperbaharui dari MongoDB
router.post("/edit-task/:title/:id", updateTask);

// SORT TASK - Client mengurutkan data ke dalam task collection berdasarkan kolom sortCriteria dan sortOrder 
router.post("/project/:sortCriteria/:sortOrder", sortTask);

// DRAG AND MOVE 
router.post("/project/dragndrop/:title/:id", dragAndMoveTask);

// Mengekspor objek router
module.exports = router;
