// Memuat modul Mongoose untuk berinteraksi dengan MongoDB
const mongoose = require('mongoose');

// Mendefinisikan schema untuk task
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    collaborators: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    }
});

// Membuat model 'Task' dari schema
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
