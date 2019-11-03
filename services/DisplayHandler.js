const WifiState = require("./WifiState");
const UsersManager = require("./UsersManager");

let lastCommandSent = 0;

function init() {
  WifiState.on("data", list => {
    const newData = list.map(item => {
      const since = new Date(item.last_time_seen + "Z");
      const newItem = {
        mac: item.station_mac,
        signal: item.power,
        since: Date.now() - since.getTime()
      };
      return newItem;
    });
    const sortedData = newData
      .sort((a, b) => (a.signal < b.signal ? 1 : -1))
      .filter(item => item.signal >= -50 && item.since <= 30000)
      .map(item => {
        const userDetails = UsersManager.getUserByMac(item.mac);
        return {
          name: userDetails ? userDetails.name : "",
          pic: userDetails && userDetails.pic ? userDetails.pic : "",
          description: userDetails ? userDetails.text : "",
          mac: item.mac
        };
      })
      .filter(item => item.name);
    // .forEach(item => {
    //   console.log(item);
    // });
    sortedData.forEach(item => console.log(new Date().toJSON(), item.name));
    if (sortedData.length) {
      if (Date.now() - lastCommandSent >= 10000) {
        io.emit("show", sortedData[0]);
        lastCommandSent = Date.now();
      }
    }
  });
}

module.exports = {
  init
};
