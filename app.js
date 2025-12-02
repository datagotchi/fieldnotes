import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { createServer } from "http";
import path from "path";
import { Pool } from "pg";

// import indexRouter from "./routes/index.js";
// import usersRouter from "./routes/users";
import notesRouter from "./routes/notes.js";
import fieldsRouter from "./routes/fields.js";
// var debug = require("debug")("fieldnotes:server");

const pool = new Pool({
  user: "postgres",
  password: "p4ssw0rd", // TODO: the ident is configured as `trust`, so this is redundant
  database: "fieldnotes",
  host: "localhost",
  port: 5432,
  // max: 50, // 10 is default
  // idleTimeoutMillis: 10000, // 10000 is default
  // connectionTimeoutMillis: 2000, // 0 (no timeout!) is default
});
pool.on("error", (err) => {
  console.error("pg pool error: ", err);
  process.exit();
});

var app = express();

app.use(async (req, res, next) => {
  try {
    req.pool = pool;
    next();
  } catch (err) {
    console.error(err);
    console.error("TotalCount", pool.totalCount);
    console.error("IdleCount", pool.idleCount);
    console.error("WaitingCount", pool.waitingCount);
    console.error("So, restarting server...");
    process.exit();
  }
});

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

const staticPath = path.join(process.cwd(), "public/dist");
app.use(express.static(staticPath));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/fields", fieldsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send("error");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

var server = createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") throw error;
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  // debug("Listening on " + bind);
  console.log("Listening on " + bind);
}

export default app;
