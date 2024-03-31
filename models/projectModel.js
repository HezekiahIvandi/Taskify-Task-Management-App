const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  tag: String,
  description: String,
  date: String, // Atau Anda bisa menggunakan tipe Date jika tanggal disimpan dalam format tanggal
  comments: Number,
  owner: String
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
