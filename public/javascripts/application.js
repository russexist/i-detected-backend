$(function () {
  var socket = io();

  socket.on('show', function(data){
    if (data && data.pic) {
      let imageUrl = `http://192.168.1.204:5000/uploads/${data.pic}`;

      showPicView(imageUrl);
      setTimeout(showDefaultView, 10000);
    }
  });
});
