import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { createServer } from "http";
import path from "path";
import { createClient } from "@libsql/client";

import usersRouter from "./routes/users.js";
import notesRouter from "./routes/notes.js";
import fieldsRouter from "./routes/fields.js";
import fieldValuesRouter from "./routes/field_values.js";

const client = createClient({
  url: "file:fieldnotes.db",
});

// TODO: remove this and/or change the req.pool.query() calls throughout the routes
const pool = {
  query: async (textOrConfig, params) => {
    let sql = "";
    let args = [];

    if (typeof textOrConfig === "string") {
      sql = textOrConfig;
      args = params || [];
    } else {
      // It's a Config Object: { text: "...", values: [...] }
      sql = textOrConfig.text;
      args = textOrConfig.values || [];
    }

    const convertedSql = sql
      .replace(/\$\d+/g, "?") // $1 -> ?
      .replace(/::\w+/g, "") // Strip ::text
      .replace(/ILIKE/gi, "LIKE"); // ILIKE -> LIKE

    try {
      const result = await client.execute({
        sql: convertedSql,
        args: args || [],
      });

      return {
        rows: result.rows,
        rowCount: result.rows.length,
      };
    } catch (err) {
      console.error("libSQL Error:", err.message);
      console.error("Statement:", convertedSql);
      throw err;
    }
  },
};

var app = express();

app.get("/favicon.ico", (req, res) => res.sendStatus(204));

app.use((req, res, next) => {
  try {
    req.pool = pool;
    next();
  } catch (err) {
    console.error("Critical libSQL Access Error:", err.message);
    res.status(500).json({ error: "Database Access Error" });
  }
});

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
// TODO: rm cookieParser bc I send authentication headers
app.use(cookieParser());

const staticPath = path.join(process.cwd(), "public/dist");
app.use(express.static(staticPath));

app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/fields", fieldsRouter);
app.use("/field_values", fieldValuesRouter);

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
  res.json({ error: err });
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
  console.log("Listening on " + bind);
}

export default app;
