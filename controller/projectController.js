// Import modul yang dibutuhkan
const {
  getCollectionByTitle,
  getTaskByIdAndTitle,
} = require("./collectionUtils");
const Task = require("../models/Task");

// Mendapatkan dan membaca semua data task dari semua collection
const getAllTaskData = async (req, res) => {
  try {
    const currentOwnerId= String(req.user.id);

    // Mengambil data dari model MongoDB
    const tasksToDo = await Task.find({ title: "Task To Do 📝", ownerId: currentOwnerId });
    const onGoing = await Task.find({ title: "On Going ⏳", ownerId: currentOwnerId });
    const needsReview = await Task.find({ title: "Needs Review 🔎", ownerId: currentOwnerId });
    const done = await Task.find({ title: "Done 💯", ownerId: currentOwnerId });

    // Data yang telah diambil dari MongoDB dikemas untuk dikirimkan sebagai respons
    const columns = [
      { title: "Task To Do 📝", tasks: tasksToDo },
      { title: "On Going ⏳", tasks: onGoing },
      { title: "Needs Review 🔎", tasks: needsReview },
      { title: "Done 💯", tasks: done },
    ];

    // Data untuk Task Progress (elemen aside)
    let progressData = [
      { tag: "Perencanaan", current: 3, total: 4 },
      { tag: "Desain UI/UX", current: 1, total: 3 },
      { tag: "Frontend", current: 1, total: 2 },
      { tag: "Backend", current: 0, total: 3 },
      { tag: "Testing", current: 0, total: 2 },
      { tag: "Deployment", current: 0, total: 2 },
      { tag: "Maintenance", current: 0, total: 2 },
    ];

    // Mengembalikan halaman dengan data yang diperoleh
    res.render("project.ejs", {
      title: "Projects",
      css: "css/project.css",
      js: "js/project.js",
      layout: "mainLayout.ejs",
      columns: columns,
      progressData: progressData,
      username: req.isAuthenticated() ? req.user.name : "username",
      photoUrl: req.isAuthenticated() ? req.user.photoUrl : "",
    });

    // Jika terjadi kesalahan saat mengambil data dari MongoDB, pesan kesalahan akan dicetak ke konsol
    // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
  } catch (error) {
    console.error(`Error fetching data from MongoDB: ${error}`);
    res
      .status(500)
      .send(
        `An error occurred while fetching data from MongoDB: ${error.message}`
      );
  }
};

// Menambahkan taks baru
const createNewTask = async (req, res) => {
  try {
    // Mendapatkan informasi terkait task yang ingin ditambahkan dari request
    const { title, tag, description, date, collaborators } = req.body;
    ownerId = String(req.user.id);
    owner = req.user.name.charAt(0).toUpperCase();
    // Menyimpan task baru ke dalam collection yang sesuai
    const newTask = new Task({
      title,
      tag,
      description,
      date,
      collaborators,
      ownerId,
      owner,
    });

    await newTask
      .save()
      .then((savedTask) => {
        console.log(savedTask);
        // Mengarahkan kembali ke halaman project setelah menambahkan task baru
        res.redirect("/project");
      })
      .catch((err) => console.log(err));

    // Jika terjadi kesalahan saat membuat task baru, pesan kesalahan akan dicetak ke konsol
    // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
  } catch (error) {
    console.error(`Error creating new task: ${error}`);
    res
      .status(500)
      .send(`An error occurred while creating a new task: ${error.message}`);
  }
};

// Menghapus task tertentu
const deleteTask = async (req, res) => {
  try {
    // Mendapatkan title dan ID task yang ingin dihapus dari request
    const { title, id } = req.params;
    // Menghapus task dari collection yang sesuai berdasarkan ID
    const result = await Task.deleteOne({
      _id: getTaskByIdAndTitle(id, title),
    });
    // Memberikan respons jika task tidak ditemukan
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Mengarahkan kembali ke halaman project setelah menghapus task
    res.redirect("/project");

    // Jika terjadi kesalahan saat menghapus task, pesan kesalahan akan dicetak ke konsol
    // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    res
      .status(500)
      .send(`An error occurred while deleting the task: ${error.message}`);
  }
};

// Memperbaharui informasi task tertentu
const updateTask = async (req, res) => {
  try {
    // Mendapatkan title, informasi yang diperbaharui, dan ID task dari request
    const { title, id } = req.params;
    let { tag, description, date, collaborators } = req.body;
    // Memperbaharui task dalam collection yang sesuai berdasarkan ID
    await Task.updateOne(
      { _id: getTaskByIdAndTitle(id, title) },
      { $set: { tag, description, date, collaborators } }
    );

    // Mengarahkan kembali ke halaman project setelah memperbaharui task

    // Jika terjadi kesalahan saat memperbarui task, pesan kesalahan akan dicetak ke konsol
    // Server mengirimkan respons HTTP dengan status code 500 (Internal Server Error)
  } catch (error) {
    console.error(`Error updating task: ${error}`);
    res
      .status(500)
      .send(`An error occurred while updating the task: ${error.message}`);
  }
};

// const dragAndMoveTask = async (req, res) => {
//   try {
//     const { title, id } = req.params;
//     await Task.updateOne(
//       { _id: getTaskByIdAndTitle(id, title) },
//       { $set: { title } }
//     );
//     res.redirect("/project");
//   } catch (error) {
//     console.error(`Error moving task: ${error}`);
//     res
//       .status(500)
//       .send(`An error occurred while moving the task: ${error.message}`);
//   }
// };

const sortTask = async (req, res) => {
  try {
    const { sortCriteria } = req.params;
    let { sortOrder } = req.params;
    sortOrder = parseInt(sortOrder);
    
    let sortedTask;

    if (sortCriteria == "tag") {
      sortedTask = await Task.find().sort({ tag: sortOrder });
    } else if (sortCriteria == "description") {
      sortedTask = await Task.find().sort({ description: sortOrder });
    }

    await Task.deleteMany({});
    await Task.insertMany(sortedTask);

    res.redirect("/project"); // ini tidak berfungsi
  } catch (error) {
    console.error(`Error sorting task: ${error}`);
    res.status(500).send(`An error occurred while sorting the task: ${error.message}`);
  }
}

// Eksport fungsi-fungsi untuk digunakan di modul lain
module.exports = {
  getAllTaskData,
  createNewTask,
  deleteTask,
  updateTask,
  
  sortTask,
};
