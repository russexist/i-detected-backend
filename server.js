const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const port           = 3000;

require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err)

  let database = client.db("test");
  require('./app/routes')(app, database);

  app.listen(port, () => {
    console.log('We are live on: http://localhost:' + port);
  });
});
