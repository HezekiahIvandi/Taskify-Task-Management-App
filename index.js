const mongoose = require('mongoose');
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 3000;
const bodyParser = require('body-parser');
const Task = require('./models/projectModel');

const chatRoutes = require("./routes/chatRoutes");
const homeRoutes = require("./routes/homeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

require('dotenv').config();

// Inisialisasi koneksi ke MongoDB menggunakan mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Gunakan body-parser middleware
    app.use(bodyParser.json());
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(expressLayouts);

    //menyimpan current url ke variable lokal currentPage (variable digunakan di navbar.ejs)
    app.use((req, res, next) => {
      res.locals.currentPage = req.path;
      next();
    });

    //Route handling
    app.use(homeRoutes);
    app.use(projectRoutes);
    app.use(chatRoutes);
    app.use(authRoutes);

    // Ambil data dari koleksi tasks
    try {
      const tasks = await Task.find({});
      console.log('Tasks:', tasks);
      // Lakukan sesuatu dengan data tasks yang ditemukan di sini
    } catch (err) {
      console.error('Error:', err);
    }

    // Membuat koneksi ke MongoDB saat aplikasi dimulai
    async function startApp() {
      try {
        const client = mongoose.connection;
        console.log('Connected to MongoDB');
        // Panggil fungsi untuk menentukan rute-rute di sini
        defineRoutes(client);

      } catch (error) {
        console.error('Error starting app', error);
      }
    }

    // Definisikan rute-rute aplikasi setelah koneksi MongoDB dibuat
    function defineRoutes(client) {
      // Rute untuk menampilkan semua tugas (GET)
      app.get("/project", async (req, res) => {
        try {
          const database = client.db('task-database');
          const collection = database.collection('tasks');

          const tasks = await collection.find({}).toArray();

          // Buat objek kosong untuk menyimpan tugas berdasarkan kategori
          let categorizedTasks = {};

          // Kelompokkan tugas-tugas berdasarkan kategori
          tasks.forEach(task => {
            // Pastikan kategori tersebut sudah ada dalam objek categorizedTasks
            if (!categorizedTasks[task.tag]) {
              categorizedTasks[task.tag] = [];
            }
            // Tambahkan tugas ke dalam kategori yang sesuai
            categorizedTasks[task.tag].push(task);
          });

          // Buat array columns
          let columns = [];

          // Iterasi melalui setiap kategori dan buat objek untuk setiap kolom
          for (const [title, tasks] of Object.entries(categorizedTasks)) {
            columns.push({
              title: `${title}`,
              tasks: tasks
            });
          }

          // Kirim respons dengan daftar tugas yang sudah dikategorikan
          res.json(columns);
        } catch (error) {
          console.error("Error saat mengambil daftar tugas:", error);
          res.status(500).send("Terjadi kesalahan saat mengambil daftar tugas");
        }
      });


      // Rute untuk menambahkan tugas baru (POST)
      app.post("/project", async (req, res) => {
        try {
          // Ambil data tugas dari permintaan POST
          const taskData = req.body;

          // Masukkan data tugas ke dalam database
          const database = client.db('task-database');
          const collection = database.collection('tasks');
          const result = await collection.insertOne(taskData);

          // Kirim respons sukses
          res.status(201).send("Tugas berhasil ditambahkan");
        } catch (error) {
          console.error("Error saat menambahkan tugas:", error);
          res.status(500).send("Terjadi kesalahan saat menambahkan tugas");
        }
      });

      // Rute untuk mengubah tugas (PUT)
      app.put("/project/:id", async (req, res) => {
        try {
          const taskId = req.params.id;
          const updatedTaskData = req.body;

          // Update data tugas di dalam database
          const database = client.db('task-database');
          const collection = database.collection('tasks');
          const result = await collection.updateOne({ _id: ObjectId(taskId) }, { $set: updatedTaskData });

          // Kirim respons sukses
          res.status(200).send("Tugas berhasil diperbarui");
        } catch (error) {
          console.error("Error saat memperbarui tugas:", error);
          res.status(500).send("Terjadi kesalahan saat memperbarui tugas");
        }
      });

      // Rute untuk menghapus tugas (DELETE)
      app.delete("/project/:id", async (req, res) => {
        try {
          const taskId = req.params.id;

          // Hapus tugas dari database
          const database = client.db('task-database');
          const collection = database.collection('tasks');
          const result = await collection.deleteOne({ _id: ObjectId(taskId) });

          // Kirim respons sukses
          res.status(200).send("Tugas berhasil dihapus");
        } catch (error) {
          console.error("Error saat menghapus tugas:", error);
          res.status(500).send("Terjadi kesalahan saat menghapus tugas");
        }
      });

      //Memulai server
      app.listen(port, () => {
        console.log(`Server is up on port localhost:${port}`);
      });
    }
    // Panggil fungsi startApp untuk memulai aplikasi
    startApp();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
