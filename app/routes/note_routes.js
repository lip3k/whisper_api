var ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {



  app.get('/whispers', (req, res) => {
    db.collection('whispers').find({}).toArray((err, whispers) => {
      if (err) throw error;
      res.send({whispers, ip: req.ip});
    });
  });



  app.post('/whisper', (req, res) => {
    const whisper = {
      _id: new ObjectID(1),
      text: req.body.body,
      author: req.body.title,
      rating: 0,

    };
    db.collection('whispers').insert(whisper, (err, result) => {
      if (err) {
        res.send({
          'error': 'An error has occurred'
        });
      } else {
        res.send(result.ops[0]);
      }
    });
  });



  // app.delete('/notes/:id', (req, res) => {
  //   const id = req.params.id;
  //   const details = {
  //     '_id': new ObjectID(id)
  //   };
  //   db.collection('notes').remove(details, (err, item) => {
  //     if (err) {
  //       res.send({
  //         'error': 'An error has occurred'
  //       });
  //     } else {
  //       res.send('Note ' + id + ' deleted!');
  //     }
  //   });
  // });



  // app.put('/notes/:id', (req, res) => {
  //   const id = req.params.id;
  //   const details = {
  //     '_id': new ObjectID(id)
  //   };
  //   const note = {
  //     text: req.body.body,
  //     title: req.body.title
  //   };
  //   db.collection('notes').update(details, note, (err, result) => {
  //     if (err) {
  //       res.send({
  //         'error': 'An error has occurred'
  //       });
  //     } else {
  //       res.send(note);
  //     }
  //   });
  // });
};
