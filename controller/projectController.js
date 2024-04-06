// Import modul yang dibutuhkan
const express = require("express");
const mongoose = require("mongoose");
const TaskToDo = require("../models/TaskToDo");
const OnGoing = require("../models/OnGoing");
const NeedsReview = require("../models/NeedsReview");
const Done = require("../models/Done");

const determineCollectionName = (title) => {
    switch (title) {
        case "Task To Do 📝":
            return "TaskToDo";
        case "On Going ⏳":
            return "OnGoing";
        case "Needs Review 🔎":
            return "NeedsReview";
        case "Done 💯":
            return "Done";
        default:
            throw new Error("Invalid title provided");
    }
};

const getAllTaskData = async (req, res) => {
    try {
        // Fetching data from MongoDB models
        const tasksToDo = await TaskToDo.find({});
        const onGoing = await OnGoing.find({});
        const needsReview = await NeedsReview.find({});
        const done = await Done.find({});

        const columns = [
            { title: "Task To Do 📝", tasks: tasksToDo },
            { title: "On Going ⏳", tasks: onGoing },
            { title: "Needs Review 🔎", tasks: needsReview },
            { title: "Done 💯", tasks: done },
        ];

        let progressData = [
            { tag: "Perencanaan", current: 3, total: 4 },
            { tag: "Desain UI/UX", current: 1, total: 3 },
            { tag: "Frontend", current: 1, total: 2 },
            { tag: "Backend", current: 0, total: 3 },
            { tag: "Testing", current: 0, total: 2 },
            { tag: "Deployment", current: 0, total: 2 },
            { tag: "Maintenance", current: 0, total: 2 },
        ];

        res.render("project.ejs", {
            title: "Projects",
            css: "css/project.css",
            js: "js/project.js",
            layout: "mainLayout.ejs",
            columns: columns,
            progressData: progressData,
        });
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).send("An error occurred while fetching data from MongoDB");
    }
};

const createNewTask = async (req, res) => {
    try {
        const { title, tag, description, date, comments, owner } = req.body;
        const collectionName = determineCollectionName(title);
        const collection = mongoose.connection.db.collection(collectionName);
        await collection.insertOne({ title, tag, description, date, comments, owner });
        res.redirect('/project');
    } catch (error) {
        console.error("Error creating new task:", error);
        res.status(500).send("An error occurred while creating a new task");
    }
};

const deleteTask = async (req, res) => {
    try {
        const title = req.params.title;
        const collectionName = determineCollectionName(title);
        const collection = mongoose.connection.db.collection(collectionName);
        const id = new mongoose.Types.ObjectId(req.params.id);
        const result = await collection.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.redirect("/project");
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("An error occurred while deleting the task");
    }
};

const updateTask = async (req, res) => {
    try {
        const title = req.params.title;
        const { tag, description, date, comments, owner } = req.body;
        const collectionName = determineCollectionName(title);
        const collection = mongoose.connection.db.collection(collectionName);
        const id = new mongoose.Types.ObjectId(req.params.id);
        await collection.updateOne({ _id: id }, { $set: { tag, description, date, comments, owner } });
        res.redirect("/project");
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("An error occurred while updating the task");
    }
};

module.exports = {
    getAllTaskData,
    createNewTask,
    deleteTask,
    updateTask,
};


module.exports = {
    getAllTaskData, 
    createNewTask, 
    deleteTask,
    updateTask,
};