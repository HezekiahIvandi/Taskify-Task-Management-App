const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 3000;

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
app.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Home",
    css: "css/home.css",
    js: "js/home.js",
    layout: "mainLayout.ejs",
  });
});

app.get("/chat", (req, res) => {
  res.render("chat.ejs", {
    title: "Conversations",
    css: "css/chat.css",
    js: "js/chat.js",
    layout: "mainLayout.ejs",
  });
});
app.get("/project", (req, res) => {
  let columns = [
    {
        title: 'Task To Do 📝',
        tasks: [
            { tag: 'Maintenance', description: 'Peningkatan fitur berdasarkan umpan balik pengguna dan evaluasi kinerja.', date: 'Feb 27', comments: 2, owner: 'M' },
            { tag: 'Deployment', description: 'Peluncuran aplikasi ke lingkungan produksi dengan pemantauan stabilitas setelah peluncuran.', date: 'Feb 29', comments: 6, owner: 'V' },
            { tag: 'Backend', description: 'Menentukan teknologi backend yang tepat berdasarkan skala dan kompleksitas proyek.', date: 'Feb 23', comments: 12, owner: 'H' },
            { tag: 'Maintenance', description: 'Perbaikan bug dan masalah yang terdeteksi setelah peluncuran.', date: 'March 1', comments: 5, owner: 'M' }
        ]
    },
    {
        title: 'On Going ⏳',
        tasks: [
            { tag: 'Desain UI/UX', description: 'Pembuatan wireframe dan mockup untuk merencanakan tata letak dan navigasi.', date: 'Feb 25', comments: 3, owner: 'M' },
            { tag: 'Desain UI/UX', description: 'Desain antarmuka pengguna (UI) termasuk warna, tipografi, ikon, dan elemen grafis lainnya.', date: 'Feb 27', comments: 6, owner: 'H' },
            { tag: 'Perencanaan', description: 'Analisis pesaing dan pasar untuk memahami tren dan kebutuhan pengguna.', date: 'Feb 12', comments: 17, owner: 'V' },
            { tag: 'Backend', description: 'Implementasi API untuk interaksi antara frontend dan backend.', date: 'Feb 21', comments: 4, owner: 'H' },
            { tag: 'Frontend', description: 'Implementasi desain UI/UX menggunakan HTML, CSS, dan JavaScript.', date: 'Mar 8', comments: 8, owner: 'M' }
        ]
    },
    {
        title: 'Needs Review 🔎',
        tasks: [
            { tag: 'Testing', description: 'Pengujian fungsionalitas aplikasi untuk memastikan bahwa semua fitur berjalan dengan baik.', date: 'Feb 5', comments: 3, owner: 'H' },
            { tag: 'Testing', description: 'Pengujian integrasi untuk memverifikasi koneksi antara komponen backend dan frontend.', date: 'Feb 9', comments: 6, owner: 'M' },
            { tag: 'Deployment', description: 'Persiapan infrastruktur untuk hosting aplikasi.', date: 'March 21', comments: 13, owner: 'H' },
            { tag: 'Backend', description: 'Pengembangan logika bisnis dan fungsi server-side.', date: 'Feb 15', comments: 4, owner: 'V' }
        ]
    },
    {
        title: 'Done 💯',
        tasks: [
            { tag: 'Perencanaan', description: 'Identifikasi kebutuhan pengguna dan tujuan aplikasi.', date: 'Jan 27', comments: 10, owner: 'V' },
            { tag: 'Perencanaan', description: 'Membuat rencana proyek dan jadwal waktu.', date: 'Jan 19', comments: 13, owner: 'H' },
            { tag: 'Perencanaan', description: 'Identifikasi kebutuhan pengguna dan tujuan aplikasi.', date: 'Feb 2', comments: 4, owner: 'M' },
            { tag: 'Desain UI/UX', description: 'Pengujian prototipe untuk mengumpulkan umpan balik pengguna.', date: 'Jan 12', comments: 7, owner: 'V' },
            { tag: 'Frontend', description: 'Pengujian antarmuka pengguna untuk memastikan kinerja dan kegunaan yang baik.', date: 'Jan 24', comments: 9, owner: 'M' }
        ]
    }
  ];

  let progressData = [
    { tag: 'Perencanaan', current: 3, total: 4 },
    { tag: 'Desain UI/UX', current: 1, total: 3 },
    { tag: 'Frontend', current: 1, total: 2 },
    { tag: 'Backend', current: 0, total: 3 },
    { tag: 'Testing', current: 0, total: 2 },
    { tag: 'Deployment', current: 0, total: 2 },
    { tag: 'Maintenance', current: 0, total: 2 },
  ];

  res.render("project.ejs", {
    title: "Projects",
    css: "css/project.css",
    js: "js/project.js",
    layout: "mainLayout.ejs",
    columns: columns,
    progressData: progressData,
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
    css: "css/login.css",
    js: "js/login.js",
    layout: "mainLayout.ejs",
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", {
    title: "Register",
    css: "css/register.css",
    js: "js/register.js",
    layout: "mainLayout.ejs",
  });
});

//Memulai server
app.listen(port, () => {
  console.log(`server is up on port localhost:${port}`);
});
