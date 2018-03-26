var ObjectID = require('mongodb').ObjectID;
var LIMIT = 5;
module.exports = (app, db) => {


    app.get('/all_whispers', (req, res) => {

        // console.log('COUNT', db.collection('whispers').count());


        db.collection('whispers').find({}).sort({sequence: -1}).skip(5).limit(20).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });

    app.get('/new_whispers/:index', (req, res) => {
        let index = req.params.index || 0;

        db.collection('whispers').find({}).sort({sequence: -1}).skip(index * LIMIT).limit(LIMIT).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });

    app.get('/best_whispers/:index', (req, res) => {
        let index = req.params.index || 0;

        db.collection('whispers').find({}).sort({rating: -1}).skip(index * LIMIT).limit(LIMIT).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });


    app.post('/new_whisper', (req, res) => {

        getCounters().then((counters) => {
            counters.whispers = parseInt(counters.whispers, 10) + 1;
            saveCounters(counters);

            let author = req.body.author && req.body.author.length > 0 ? req.body.author : 'Anonymous';

            const whisper = {
                text: req.body.text,
                author: author,
                postedOn: Date.now(),
                rating: 1,
                votes: [req.ip],
                sequence: counters.whispers
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
    });

    function getCounters() {
        return new Promise((resolve, reject) => {
            /*           return db.collection('counters').find({}(err, result) => {
                           if (err) {
                               reject(err);
                           } else {
                               resolve(result);
                           }
                       });*/
            db.collection('counters').find({}).toArray((err, result) => {
                if (err) throw error;
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }

            });
        });
    }

    function saveCounters(counters) {
        db.collection('counters').update({"_id": ObjectID(counters._id)}, counters, (err, res) => {
            if (err) {
                console.error(err);
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


    app.get('/give_love/:id', (req, res) => {
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
