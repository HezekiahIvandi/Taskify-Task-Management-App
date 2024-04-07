const mongoose = require('mongoose');

// Definisikan schema untuk tugas
const onGoingSchema = new mongoose.Schema({
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
}, { collection: 'On Going' }); // Menentukan nama koleksi;

// Buat model 'OnGoing' dari schema
module.exports = mongoose.model('OnGoing', onGoingSchema);