var ObjectID = require('mongodb').ObjectID;
var LIMIT = 20;
module.exports = (app, db) => {


    app.get('/all_whispers', (req, res) => {

        console.log(db.collection('whispers').count());

        db.collection('whispers').find({}).skip(5).limit(20).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });

    app.get('/getWhispers/:index', (req, res) => {
        let index = req.params.index || 0;

        db.collection('whispers').find({}).skip(index * LIMIT).limit(LIMIT).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });


    app.post('/new_whisper', (req, res) => {

        let counter = getCounters();
        console.log(counter);
        counter.whispers += 1;

        saveCounters(counter);

        let author = req.body.author && req.body.author.length > 0 ? req.body.author : 'Anonymous';

        const whisper = {
            sequence: counter.whispers,
            text: req.body.text,
            author: author,
            postedOn: Date.now(),
            rating: 1,
            votes: [req.ip],
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

    function getCounters() {
        db.collection('counters').find({}).limit(1).toArray((err, counters) => {
            if (err) throw error;
            return counters;
        });
    }

    function saveCounters(counters) {
        db.collection('counters').update({"_id": ObjectID(counters._id)}, counters, (err, updateRes) => {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            }
        });
    }


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


    app.get('/giveLove/:id', (req, res) => {
        const id = req.params.id;
        db.collection('whispers').findOne({"_id": ObjectID(id)}, (err, whisper) => {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
                return;
            }

            if (whisper.votes.includes(req.ip)) {
                res.send({
                    'error': 'Already voted for this one mate'
                });
                return;
            }

            whisper.rating += 1;
            if (req.ip) {
                whisper.votes.push(req.ip);
            }

            db.collection('whispers').update({"_id": ObjectID(id)}, whisper, (err, updateRes) => {
                if (err) {
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    res.send(updateRes);
                }
            });
        });


    });
};
