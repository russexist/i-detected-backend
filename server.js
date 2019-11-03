const app         = require('express')();
const http        = require('http').createServer(app);
const io          = require('socket.io')(http);
const port        = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const bodyParser  = require('body-parser');
const path        = require('path');
const cors        = require('cors');
const axios       = require('axios');

global.axios = axios;
global.io = io;
global.path = path;

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(request, response, next) {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} | ${request.get("user-agent")}`;
  console.log();
  next();
});

MongoClient.connect(process.env.MONGOLAB_OLIVE_URI, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err)

  let database = client.db(process.env.DATABASE_NAME);
  require('./routes')(app, database);

  http.listen(port, () => {
    console.log('We are live on:' + port);
  });
});
