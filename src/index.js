const express = require("express");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");

const systemConfig = require("./config/db/system");
const db = require("./config/db");

const app = express();

// database connection
db.connect();

// app locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// middleware
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Session + flash
app.use(cookieParser("AFK27062005"));
app.use(
  session({
    secret: "AFK27062005",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.locals.basedir = path.join(__dirname, "views");

// route
const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/clients/index_route");

routeAdmin(app);
routeClient(app);

// 404 fallback
app.use((req, res) => {
  res.status(404).render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

// Nếu chạy local => listen, nếu deploy Vercel => export
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ App running at http://localhost:${PORT}`);
  });
} else {
  module.exports = app;
}
