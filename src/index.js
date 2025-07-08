const express = require("express");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const path = require("path");
const port = process.env.PORT;
const bodyParser = require("body-parser");

const systemConfig = require("./config/db/system");
const db = require("./config/db");
const moment = require("moment");

// Connect to DB
db.connect();

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Method override – ⚠️ Phải đặt TRƯỚC routes
app.use(methodOverride("_method"));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Flash
app.use(cookieParser("AFK27062005"));
app.use(
  session({
    secret: "AFK27062005", // dùng chung với cookieParser
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.use(flash());

// Tiny MCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Set views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.locals.basedir = path.join(__dirname, "views");

// Routes – Đặt SAU middleware
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/clients/index_route");

routeAdmin(app);
route(app);
app.get("/*w", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

// Listen
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
