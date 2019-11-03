let interval;

function usersUpdaterStart(db) {
  if (interval) return;
  interval = setInterval(() => {
    axios
      .get(process.env.RASPBERY_DATA_URL)
      .then((res) => {
        // console.log('----------------------------------------');

        let macAddresses = res.data.map((elem, index) => {
          return elem.station_mac.toUpperCase();
        });

        // console.log(macAddresses.length);

        // { station_mac: { $in: macAddresses }, $and: [{ power:  { $ne: [0, -1, '', '0', '-1'] } }] }
        db.collection('users')
          .find({ station_mac: { $in: macAddresses } })
          .sort({ power: -1 })
          .toArray((err, users) => {
            io.emit('data-list', users);
            // console.log(users);
          });
      })

      .catch((err) => {
        console.log('Raspberry: Connection Error!');
      });
  }, 1000);
}

function usersUpdaterStop() {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
}

module.exports = {
  usersUpdaterStart,
  usersUpdaterStop,
};
