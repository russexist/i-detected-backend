const routes = require('./note_routes');

module.exports = function(app, db) {
  routes(app, db);
};
