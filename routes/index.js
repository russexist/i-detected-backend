const user_routes = require('./user_routes');

module.exports = function(app, db) {
  user_routes(app, db);
};
