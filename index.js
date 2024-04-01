const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 3000;

const chatRoutes = require("./routes/chatRoutes");
const homeRoutes = require("./routes/homeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
app.set("view engine", "ejs");

dotenv.config();
const MONGO_CHAT_URL = process.env.MONGO_CHAT_URL;
app.use(express.json());
app.use(morgan("dev"));
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

//Connect to mongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_CHAT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectToDB();

//Memulai server
app.listen(port, () => {
  console.log(`server is up on port http://localhost:${port}`);
});
