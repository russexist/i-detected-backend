const EventEmitter = require("events").EventEmitter;
const Axios = require("axios");

class WifiState extends EventEmitter {
  constructor() {
    super();
    this.interval = 0;
    this.data = [];
  }
  init() {
    if (this.interval) return;
    this.interval = setInterval(() => this.processInterval(), 1000);
  }

  processInterval() {
    Axios.get(process.env.RASPBERY_DATA_URL).then(res => {
      this.data = res.data;
      this.emit("data", res.data);
    });
  }
}

module.exports = new WifiState();
