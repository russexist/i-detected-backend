var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.redirect('users')
  });

  app.get('/users', (req, res) => {
    db.collection('users').find().toArray(function(err, results) {
      if (err) {
        res.send(err);
      } else {
        res.send(results)
      }
    });
  });

  app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('users').findOne(details, (err, item) => {
      if (err) {
        res.send(err);
      } else {
        res.send(item);
      }
    });
  });

  app.post('/users', (req, res) => {
    const user = {
      name: req.body.name,
      station_mac: req.body.station_mac,
      first_time_seen: req.body.first_time_seen,
      last_time_seen: req.body.last_time_seen,
      power: req.body.power,
      packets: req.body.packets,
      bssid: req.body.bssid,
      essids: req.body.essids
    };

    db.collection('users').insertOne(user, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result.ops[0]);
      }
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
      essids: req.body.essids
    };

    db.collection('users').update(details, user, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(user);
      }
    });
  });

  app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('users').deleteOne(details, (err, item) => {
      if (err) {
        res.send(err);
      } else {
        res.send('User ' + id + ' deleted!');
      }
    });
  });
};
