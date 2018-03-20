const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
let db = require('./config/db');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)

  db = database.db('whisper_db')

  require('./app/routes')(app, db);

  app.listen(port, () => {
    console.log('Live on', port);
  });
})
