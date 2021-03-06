var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const serveIndex = require("serve-index");

var imageRouter = require("./routes/image");
var videoRouter = require("./routes/video");
const uploadRouter = require("./routes/upload");
const commonRouter = require("./routes/common");

var app = express();

global.publicPath = path.join(__dirname, "public");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", uploadRouter);
app.use("/c", imageRouter);
app.use("/v", videoRouter);
app.use("/com", commonRouter);
app.use(
  "/public",
  express.static("public"),
  serveIndex("public", { icons: true })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
