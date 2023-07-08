require("dotenv").config();
const db = require("./src/services/database.services");
const { createResponse } = require("./src/utils/helpers");

var serverInitialized = false;

(async () => {
  try {
    await db.connectdb();
    serverInitialized = true;
  } catch (e) {
    console.error(`Error occured when starting the server with a message ${e.message}`);
    process.exit(1);
  }
})();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var usersRouter = require("./src/routes/user.route");

const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 4080 });
const { eventManagement } = require("./src/routes/websocket.route");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Orign, X-Requested-With,Content-Type,Accept,Authorization", "token");
  res.header("Access-Control-Expose-Headers", "token");
  next();
});

app.use("/api/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createResponse("Api not found", 404));
});

// error handler
app.use((error, req, res, next) => {
  var statusCode = error.status || 500;
  var message = error.message || "Error undefined";
  res.status(statusCode).send({ message });
});

wss.on("connection", (ws) => {
  try {
    if (!serverInitialized) {
      ws.send(JSON.stringify({ status: 503, message: "Server not initialized yet" }), () => {
        ws.close();
      });
    }

    ws.send("Connected");

    ws.on("message", (message) => {
      try {
        eventManagement(wss, ws, message);
      } catch (e) {
        console.log(`Error in onMessage`, e);
        ws.send(JSON.stringify({ status: 500, message: e.message }), () => {
          ws.close();
        });
      }
    });
  } catch (e) {
    console.log("connection error", e);
    ws.send(JSON.stringify(e.message), () => {
      ws.close();
    });
  }
});

module.exports = app;
