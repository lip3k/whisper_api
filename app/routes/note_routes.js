var ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {


    app.get('/all_whispers', (req, res) => {
        console.log(new ObjectID(1));
        db.collection('whispers').find({}, {$slice: 5}).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });


    app.post('/new_whisper', (req, res) => {

        let author = req.body.author && req.body.author.length > 0 ? req.body.author : 'Anonymous';

        const whisper = {
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
