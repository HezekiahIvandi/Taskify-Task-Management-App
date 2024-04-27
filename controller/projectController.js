// Import modul-modul yang dibutuhkan
const { getTaskByIdAndTitle } = require("./collectionUtils");
const Task = require("../models/Task");

// Membaca semua task dari task collection
const getAllTaskData = async (req, res) => {
  try {
    const currentOwnerId= String(req.user.id);

    // Mengambil data dari model MongoDB untuk setiap title
    const tasksToDo = await Task.find({ title: "Task To Do 📝", ownerId: currentOwnerId });
    const onGoing = await Task.find({ title: "On Going ⏳", ownerId: currentOwnerId });
    const needsReview = await Task.find({ title: "Needs Review 🔎", ownerId: currentOwnerId });
    const done = await Task.find({ title: "Done 💯", ownerId: currentOwnerId });

    // Data yang diperoleh dikemas untuk dikirim sebagai respons
    const columns = [
      { title: "Task To Do 📝", tasks: tasksToDo },
      { title: "On Going ⏳", tasks: onGoing },
      { title: "Needs Review 🔎", tasks: needsReview },
      { title: "Done 💯", tasks: done },
    ];

    // Data untuk Task Progress (elemen aside)
    let doneTags = [];
    done.forEach(task => {
      doneTags = doneTags.concat(task.tag);
    });
    
    let otherTags = [];
    tasksToDo.concat(onGoing, needsReview, done).forEach(task => {
      otherTags = otherTags.concat(task.tag);
    });
  
    function generateProgressData(doneTags, otherTags) {
      let progressData = {};
    
      // Menghitung jumlah tag untuk task "Done"
      doneTags.forEach(tag => {
        progressData[tag] = { tag: tag, current: doneTags.filter(t => t === tag).length, total: 0 };
      });
    
      // Menghitung jumlah tag untuk task selain "Done"
      otherTags.forEach(tag => {
        if (!progressData[tag]) {
          progressData[tag] = { tag: tag, current: 0, total: otherTags.filter(t => t === tag).length };
        } else {
          progressData[tag].total = otherTags.filter(t => t === tag).length;
        }
      });
    
      // Mengonversi hasil ke dalam bentuk array
      return Object.values(progressData);
    }
    
    // Contoh penggunaan fungsi
    const progressData = generateProgressData(doneTags, otherTags);
    console.log(progressData);

    // let progressData = [
    //   { tag: "Perencanaan", current: 3, total: 4 },
    //   { tag: "Desain UI/UX", current: 1, total: 3 },
    //   { tag: "Frontend", current: 1, total: 2 },
    //   { tag: "Backend", current: 0, total: 3 },
    //   { tag: "Testing", current: 0, total: 2 },
    //   { tag: "Deployment", current: 0, total: 2 },
    //   { tag: "Maintenance", current: 0, total: 2 },
    // ];

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

    // Jika terjadi error, error message akan dicetak ke console
    // Server mengirim respons HTTP dengan status code 500: Internal Server Error
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
    // Membaca informasi dari task baru yang ingin ditambahkan
    const { title, tag, description, date, collaborators } = req.body;
    
    // Membaca user id dan name (hanya inisial) pemilik task
    ownerId = String(req.user.id);
    owner = req.user.name.charAt(0).toUpperCase();
    
    // Inisialisasi task baru 
    const newTask = new Task({
      title,
      tag,
      description,
      date,
      collaborators,
      ownerId,
      owner,
    });

    // Menyimpan task baru ke dalam MongoDB
    await newTask
      .save()
      .then((savedTask) => {
        res.redirect("/project"); // Redirect kembali setelah berhasil menambahkan task baru
      })
      .catch((err) => console.log(err));

    // Jika terjadi error, error message akan dicetak ke console
    // Server mengirim respons HTTP dengan status code 500: Internal Server Error
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
    // Membaca title dan ID task yang ingin dihapus
    const { title, id } = req.params;

    // Menghapus task dari MongoDB berdasarkan ID
    const result = await Task.deleteOne({
      _id: getTaskByIdAndTitle(id, title),
    });
    // Memberikan respons jika task tidak ditemukan
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Redirect kembali setelah berhasil menghapus task
    res.redirect("/project");

    // Jika terjadi error, error message akan dicetak ke console
    // Server mengirim respons HTTP dengan status code 500: Internal Server Error
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
    // Membaca title, ID, dan informasi task yang ingin diperbaharui
    const { title, id } = req.params;
    let { tag, description, date, collaborators } = req.body;
    
    // Memperbaharui task di MongoDB berdasarkan ID
    await Task.updateOne(
      { _id: getTaskByIdAndTitle(id, title) },
      { $set: { tag, description, date, collaborators } }
    );
    // Redirect kembali setelah berhasil memperbaharui task
    res.redirect("/project");

    // Jika terjadi error, error message akan dicetak ke console
    // Server mengirim respons HTTP dengan status code 500: Internal Server Error
  } catch (error) {
    console.error(`Error updating task: ${error}`);
    res
      .status(500)
      .send(`An error occurred while updating the task: ${error.message}`);
  }
};

// Menarik dan memindahkan task ke kolom lain
const dragAndMoveTask = async (req, res) => {
  try {
    // Membaca title dan ID task yang ingin dipindahkan
    const { title, id } = req.params;

    // Memperbaharui title asal ke title destinasi
    await Task.updateOne(
      { _id: getTaskByIdAndTitle(id, title) },
      { $set: { title } }
    );
    // Redirect kembali setelah berhasil memindahkan task
    res.redirect("/project");

    // Jika terjadi error, error message akan dicetak ke console
    // Server mengirim respons HTTP dengan status code 500: Internal Server Error
  } catch (error) {
    console.error(`Error moving task: ${error}`);
    res
      .status(500)
      .send(`An error occurred while moving the task: ${error.message}`);
  }
};

// Mengurutkan task berdasarkan tag atau description
const sortTask = async (req, res) => {
  try {
    // Membaca kriteria (tag / description) dan arah pengurutan (1: asc, 2: desc)
    const { sortCriteria } = req.params;
    let { sortOrder } = req.params;
    sortOrder = parseInt(sortOrder);
    
    let sortedTask; // Variabel untuk menyimpas task yang sudah diurutkan

    // Memeriksa kriteria dan mengurutkan task sesuai dengan kriteria tersebut
    if (sortCriteria == "tag") {
      sortedTask = await Task.find().sort({ tag: sortOrder });
    } else if (sortCriteria == "description") {
      sortedTask = await Task.find().sort({ description: sortOrder });
    }

    // Menghapus semua task yang ada di task collection
    await Task.deleteMany({});
    // Memasukkan kembali task yang sudah diurutkan ke task collection
    await Task.insertMany(sortedTask);
    // Redirect kembali setelah berhasil memindahkan task
    res.redirect("/project");

    // Jika terjadi error, error message akan dicetak ke console
    // Server mengirim respons HTTP dengan status code 500: Internal Server Error
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
  dragAndMoveTask,
  sortTask,
};
