const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
let db = require('./config/db');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)

  db = database.db('whisper_db')

  require('./app/routes')(app, db);

  app.listen(process.env.PORT || 3000, () => {
    console.log('Live');
  });
})
