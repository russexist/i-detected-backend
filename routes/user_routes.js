const ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve() + '/views/index.html');
  });

  app.get('/users', (req, res) => {
    db.collection('users').find().toArray(function(err, results) {
      res.send(err ? err : results);
    });
  });

  app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('users').findOne(details, (err, item) => {
      res.send(err ? err : item);
    });
  });

  app.post('/users', (req, res) => {
    if(!req.body) return res.sendStatus(400);

    let users = req.body.map((elem, index) => {
      return {
        name: elem.name || '',
        station_mac: elem.station_mac || '',
        first_time_seen: elem.first_time_seen || '',
        last_time_seen: elem.last_time_seen || '',
        power: elem.power || '',
        packets: elem.packets || '',
        bssid: elem.bssid || '',
        essids: elem.essids || '',
        text: elem.text || '',
        text_color: elem.text_color || ''
      }
    });

    db.collection('users').insertMany(users, (err, result) => {
      res.send(err ? err : result.ops[0]);
    });
  });

  app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const user = {
      name: req.body.name,
      station_mac: req.body.station_mac,
      first_time_seen: req.body.first_time_seen,
      last_time_seen: req.body.last_time_seen,
      power: req.body.power,
      packets: req.body.packets,
      bssid: req.body.bssid,
      essids: req.body.essids,
      text: req.body.text,
      text_color: req.body.text_color
    };

    db.collection('users').updateOne(details, user, (err, result) => {
      res.send(err ? err : user);
    });
  });

  app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('users').deleteOne(details, (err, item) => {
      res.send(err ? err : `User ${id} deleted!`);
    });
  });
};
