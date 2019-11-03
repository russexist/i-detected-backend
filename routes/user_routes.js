const ObjectID = require("mongodb").ObjectID;
const fs = require("fs");

module.exports = function(app, db) {
  app.get("/", (req, res) => {
    res.sendFile(path.resolve() + "/views/index.html");
  });

  // app.get('/users', (req, res) => {
  //   db.collection('users').find().toArray(function(err, results) {
  //     let result = results.map((elem, index) => {
  //       return {
  //         id: elem._id,
  //         station_mac: elem.station_mac,
  //         text: elem.text,
  //         text_color: elem.text_color,
  //         // image: function() {
  //         //   fs.readFile(path.resolve() + `/uploads/${elem._id}.jpg`, (err, file) => {
  //         //     return
  //         //   });
  //         }
  //       }
  //     });
  //     res.send(err ? err : result);
  //   });
  // });
  app.get("/users", (req, res) => {
    db.collection("users")
      .find()
      .toArray(function(err, results) {
        res.send(err ? err : results);
      });
  });

  app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };

    db.collection("users").findOne(details, (err, item) => {
      res.send(err ? err : item);
    });
  });

  app.post("/users", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    let users = req.body.map((elem, index) => {
      return {
        name: elem.name || "",
        station_mac: elem.station_mac || "",
        text: elem.text || "",
        text_color: elem.text_color || ""
      };
    });

    db.collection("users").insertMany(users, (err, result) => {
      res.send(err ? err : result.ops[0]);
    });
  });

  app.patch("/users/:id/upload", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    let file = req.files.file;
    let index = file.name.split(".").length - 1;
    let fileFormat = file.name.split(".")[index];

    file.mv(
      `${path.resolve()}/uploads/${req.params.id}.${fileFormat}`,
      function(err) {
        if (err) return res.status(500).send(err);

        res.send("File uploaded!");
      }
    );
  });

  app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
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

    db.collection("users").updateOne(details, user, (err, result) => {
      res.send(err ? err : user);
    });
  });

  app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };

    db.collection("users").deleteOne(details, (err, item) => {
      res.send(err ? err : `User ${id} deleted!`);
    });
  });
};
