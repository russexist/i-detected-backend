const ObjectID = require("mongodb").ObjectID;
const fs = require("fs");

module.exports = function(app, db) {
  app.get("/", (req, res) => {
    res.sendFile(path.resolve() + "/views/index.html");
  });

  app.get("/users", (req, res) => {
    db.collection("users")
      .find()
      .toArray(function(err, results) {
        res.send(
          err
            ? err
            : results.map(item => ({
                ...item,
                pic: item.pic || ""
              }))
        );
      });
  });

  app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };

    db.collection("users").findOne(details, (err, item) => {
      res.send(err ? err : item);
    });
  });

  app.get("/uploads/:file_name", (req, res) => {
    const fileName = req.params.file_name;
    console.log(fileName);
    res.sendFile(`${path.resolve()}/uploads/${fileName}`);
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
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded");
    }

    const id = req.params.id;

    const file = req.files.pic;
    const fileDstPath = `${path.resolve()}/uploads/${file.name}`;
    file.mv(fileDstPath, err => {
      if (err) res.status(500).send(err.message);
      else {
        const details = { _id: new ObjectID(id) };
        db.collection("users").updateOne(
          details,
          { $set: { pic: file.name } },
          (err, result) => {
            if (err) res.status(500).send(err.message);
            else res.send("ok");
          }
        );
      }
    });
  });

  app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    const user = {
      name: req.body.name,
      station_mac: req.body.station_mac,
      text: req.body.text,
      text_color: req.body.text_color
    };

    db.collection("users").updateOne(details, { $set: user }, (err, result) => {
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
