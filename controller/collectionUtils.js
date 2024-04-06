// Import modul yang dibutuhkan
const mongoose = require("mongoose");

// Fungsi untuk menentukan nama collection berdasarkan title
const determineCollectionName = (title) => {
    switch (title) {
        case "Task To Do 📝":
            return "Task To Do";
        case "On Going ⏳":
            return "On Going";
        case "Needs Review 🔎":
            return "Needs Review";
        case "Done 💯":
            return "Done";
        default:
            throw new Error(`Invalid title provided: ${title}`);
    }
};

// Fungsi untuk mendapatkan collection berdasarkan title
const getCollectionByTitle = (title) => {
    if (!title || typeof title !== "string") {
        throw new Error(`Title ${title} must be a non-empty string.`);
    }
    const collectionName = determineCollectionName(title);
    return mongoose.connection.db.collection(collectionName);
};

// Fungsi untuk mendapatkan task berdasarkan ID dan title
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
module.exports = {
    getCollectionByTitle,
    getTaskByIdAndTitle
};
