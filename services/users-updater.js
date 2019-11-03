const WifiState = require("../services/WifiState");

function init(db) {
  WifiState.on("data", list => {
    const macAddresses = list.map((elem, index) => {
      return elem.station_mac.toUpperCase();
    });

    // { station_mac: { $in: macAddresses }, $and: [{ power:  { $ne: [0, -1, '', '0', '-1'] } }] }
    db.collection("users")
      .find({ station_mac: { $in: macAddresses } })
      .sort({ power: -1 })
      .toArray((err, users) => {
        io.emit("data-list", users);
        // console.log(users);
      });
  });
}

module.exports = {
  init
};
