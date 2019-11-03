const WifiState = require("../services/WifiState");

function init(db) {
  WifiState.on("data", list => {
    const macAddresses = list.map((elem, index) => {
      return elem.station_mac.toUpperCase();
    });

    const newData = list.map(item => {
      const since = new Date(item.last_time_seen + "Z");
      const newItem = {
        mac: item.station_mac,
        signal: item.power,
        since: Date.now() - since.getTime()
      };
      return newItem;
    });

    newData
      .sort((a, b) => (a.signal < b.signal ? 1 : -1))
      .filter(item => item.signal >= -50 && item.since <= 30000)
      .forEach(item => {
        db.collection("users").findOne(
          { station_mac: item.mac },
          (err, result) => {
            let user = { ...{ name: result.name }, ...item };
            io.emit("data-list", user);
            // console.log(user);
          }
        );
      });
  });
}

module.exports = {
  init
};
