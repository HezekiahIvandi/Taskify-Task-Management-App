const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 3000;

const chatRoutes = require("./routes/chatRoutes");
const homeRoutes = require("./routes/homeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");

//static
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

//Memulai server
app.listen(port, () => {
  console.log(`server is up on port localhost:${port}`);
});
