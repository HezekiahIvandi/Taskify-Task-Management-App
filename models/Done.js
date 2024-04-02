const mongoose = require('mongoose');

// Definisikan schema untuk tugas
const doneSchema = new mongoose.Schema({
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
        type: String,
    },
    comments: {
        type: String,
        default: ''
    },
    owner: {
        type: String,
        required: true
    }
}, { collection: 'Done' }); // Menentukan nama koleksi;

// Buat model 'Done' dari schema
module.exports = mongoose.model('Done', doneSchema);