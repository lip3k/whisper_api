var ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {


    app.get('/all_whispers', (req, res) => {
        console.log(new ObjectID(1));
        db.collection('whispers').find({}).toArray((err, whispers) => {
            if (err) throw error;

            whispers = whispers.map(item => {
                item['voted'] = item.votes.includes(req.ip);
                return item;
            });

            res.send(whispers);
        });
    });


    app.post('/new_whisper', (req, res) => {
        const whisper = {
            text: req.body.text,
            author: req.body.author,
            postedOn: Date.now(),
            rating: 0,
            votes: [],
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
        console.log('IN API');
        db.collection('whispers').findOne({"_id": ObjectID(id)}, (err, whisper) => {
            if (err) {
                console.log('ERROR');
                res.send({
                    'error': 'An error has occurred'
                });
                return;
            }

            if (whisper.votes.includes(req.ip)) {
                console.log('ERROR: VOTED BEFORE');
                res.send({
                    'error': 'Already voted for this one mate'
                });
                return;
            }

            whisper.rating += 1;
            if (req.ip) {
                console.log('ADDED IP TO VOTES');
                whisper.votes.push(req.ip);
            }

            db.collection('whispers').update({"_id": ObjectID(id)}, whisper, (err, updateRes) => {
                console.log('UPDATING');
                if (err) {
                    console.log('ERROR UPDATING');
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    console.log('SUCCESS');
                    res.send(updateRes);
                }
            });
        });


    });
};
