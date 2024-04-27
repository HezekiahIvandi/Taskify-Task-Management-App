// Import modul-modul yang dibutuhkan
const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const {
  getAllTaskData,
  createNewTask,
  deleteTask,
  updateTask,
  dragAndMoveTask,
  sortTask,
} = require("../controller/projectController");

// Membuat objek router menggunakan Router()
const router = express.Router();

// READ - Server meminta semua data dari task collection untuk disajikan di sisi client
router.get("/project", ensureAuthenticated, getAllTaskData);

// CREATE - Client mengirimkan data ke Server untuk disimpan ke dalam task collection
router.post("/project", createNewTask);

// DELETE - Client mengirimkan data ke Server untuk dihapus dari task collection
router.post("/delete-task/:title/:id", deleteTask);

// UPDATE - Client mengirimkan data ke Server untuk diperbaharui ke dalam task collection
router.post("/edit-task/:title/:id", updateTask);

// DRAG AND MOVE - Client menarik dan memindahkan data ke Server untuk dipindahkan ke dalam title destinasi
router.post("/project/:title/:id", dragAndMoveTask);

// SORT TASK - Client mengurutkan data ke dalam task collection berdasarkan kolom sortCriteria dan sortOrder 
router.post("/project/:sortCriteria/:sortOrder", sortTask);

// Mengekspor objek router
module.exports = router;
