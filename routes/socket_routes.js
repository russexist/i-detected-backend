var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

module.exports = function(app, db) {
  app.get('/socket', function(req, res){
    res.sendFile('/views/index.html');
  });

  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });
}
