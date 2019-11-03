class UsersManager {
  constructor() {
    this.users = [];
  }

  update() {
    db.collection("users")
      .find()
      .toArray((err, result) => {
        if (!err) this.users = result;
      });
  }

  getUserByMac(mac) {
    if (!mac) return;
    return this.users.find(
      item =>
        !!(
          item &&
          "station_mac" in item &&
          item.station_mac.toLowerCase() === mac.toLowerCase()
        )
    );
  }
}

module.exports = new UsersManager();
