const mongoose = require('mongoose');

// Skema untuk tugas (sub-skema)
const taskSchema = new mongoose.Schema({
  tag: String,
  description: String,
  date: String, // Atau sesuaikan dengan tipe data yang sesuai dengan data di MongoDB
  comments: Number,
  owner: String
});

// Skema untuk dokumen utama
const mainSchema = new mongoose.Schema({
  title: String,
  tasks: [taskSchema] // Menetapkan sub-skema untuk bidang tasks
});

// Model Task berdasarkan skema di atas
const Task = mongoose.model('Task', mainSchema);

module.exports = Task;
