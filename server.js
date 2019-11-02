const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));

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
  require('./app/routes')(app, database);

  app.listen(port, () => {
    console.log('We are live on:' + port);
  });
});
