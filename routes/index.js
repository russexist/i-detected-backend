const user_routes = require('./user_routes');
const socket_routes = require('./socket_routes');

module.exports = function(app, db) {
  user_routes(app, db);
  socket_routes(app, db);
};
