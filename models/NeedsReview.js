const mongoose = require('mongoose');

// Definisikan schema untuk tugas
const needsReviewSchema = new mongoose.Schema({
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
}, { collection: 'Needs Review' }); // Menentukan nama koleksi;

// Buat model 'NeedsReview' dari schema
module.exports = mongoose.model('NeedsReview', needsReviewSchema);