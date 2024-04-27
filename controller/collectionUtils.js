// Import modul yang dibutuhkan
const mongoose = require("mongoose");

// Fungsi untuk memvalidasi title dan mendapatkan task berdasarkan ID
const getTaskByIdAndTitle = (id, title) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ID provided: ${id}`);
    }
    if (!title || typeof title !== "string") {
        throw new Error(`Title ${title} must be a non-empty string.`);
    }
    return new mongoose.Types.ObjectId(id);
};

// Eksport fungsi-fungsi untuk digunakan di modul lain
module.exports = { getTaskByIdAndTitle };
