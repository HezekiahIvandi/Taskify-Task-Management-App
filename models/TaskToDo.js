const mongoose = require('mongoose');

// Definisikan schema untuk tugas
const taskToDoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: 'General'
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    collaborators: {
        type: String,
        default: ''
    },
    owner: {
        type: String,
        required: true
    }
}, { collection: 'Task To Do' }); // Menentukan nama koleksi;

// Buat model 'TaskToDo' dari schema
module.exports = mongoose.model('TaskToDo', taskToDoSchema);