const mongoose = require('mongoose');
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 3000;
const bodyParser = require('body-parser');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const chatRoutes = require("./routes/chatRoutes");
const homeRoutes = require("./routes/homeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();

//passport config
require("./config/passport")(passport);

// Inisialisasi koneksi ke MongoDB menggunakan mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Gunakan body-parser middleware
    app.use(bodyParser.json());
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(expressLayouts);
    app.set('layout extractScripts', true);

    // express session middleware
    app.use(express.urlencoded({ extended: false }));
    app.use(
      session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
      })
    );

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    //connect flash
    app.use(flash());

    // Menyimpan current url ke variable lokal currentPage (variable digunakan di navbar.ejs)
    app.use((req, res, next) => {
      res.locals.currentPage = req.path;
      next();
    });

    // global var
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg");
      res.locals.error_msg = req.flash("error_msg");
      res.locals.error = req.flash("error");
      next();
    });

    // Route handling
    app.use(homeRoutes);
    app.use(projectRoutes);
    app.use(chatRoutes);
    app.use(authRoutes);



    // Membuat koneksi ke MongoDB saat aplikasi dimulai

    async function startApp() {
      try {
        const client = await mongoose.connection.getClient(); // Menggunakan getClient() untuk mendapatkan instance MongoClient
        console.log('Connected to MongoDB');

      } catch (error) {
        console.error('Error starting app', error);
      }
    }

    // Memulai server
    app.listen(port, () => {
      console.log(`Server is up on port http://localhost:${port}`);
    });

    // Panggil fungsi startApp untuk memulai aplikasi
    startApp();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

