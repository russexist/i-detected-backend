const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 5000;
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const WifiState = require("./services/WifiState");
const UsersUpdater = require("./services/users-updater");
const fileUpload = require("express-fileupload");
const UsersManager = require("./services/UsersManager");
const DisplayHandler = require("./services/DisplayHandler");

global.axios = axios;
global.io = io;
global.path = path;
global.fs = fs;
global.db;

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({}));
app.use(require("express").static(path.join(__dirname, 'public')));

app.use(function(request, response, next) {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let data = `${hour}:${minutes}:${seconds} ${request.method} ${
    request.url
  } | ${request.get("user-agent")}`;
  console.log(data);
  next();
});

MongoClient.connect(
  process.env.MONGOLAB_OLIVE_URI,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err);

    const database = client.db(process.env.DATABASE_NAME);
    global.db = database;
    require("./routes")(app, database);
    // usersUpdaterStart(database);
    UsersUpdater.init(database);
    WifiState.init();
    UsersManager.update();
    DisplayHandler.init();

    setInterval(() => UsersManager.update(), 10 * 1000);

    http.listen(port, () => {
      console.log("We are live on:" + port);
    });
  }
);
