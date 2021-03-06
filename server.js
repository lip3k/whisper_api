const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let db = 'mongodb://whisperer:apt8gvs3@ds213118.mlab.com:13118/whisper_db';

MongoClient.connect(process.env.DB_URL || db, (err, database) => {
  if (err) {
      return console.log(err);
  }

  db = database.db('whisper_db');

  require('./app/routes')(app, db);

  app.listen(process.env.PORT || 3000, () => {
    console.log('Live');
  });
});
