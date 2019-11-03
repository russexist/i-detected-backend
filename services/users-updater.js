const WifiState = require("../services/WifiState");
const UsersManager = require("./UsersManager");

function init(db) {
  WifiState.on("data", list => {
    const curTime = Date.now();

    const newData = list
      .map(item => {
        const user = UsersManager.getUserByMac(item.station_mac);
        return { ...item, name: user ? user.name : "" };
      })
      .filter(item => {
        const since = new Date(item.last_time_seen + "z");
        return !!(curTime - since <= 30000 && item.name);
      });

    // .forEach(item => console.log(item));
    console.log(newData);
    io.emit("data-list", newData);
  });
}

module.exports = {
  init
};
