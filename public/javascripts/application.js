$(function () {
  var socket = io();

  socket.on('show', function(data){
    if (data && data.pic) {
      let imageUrl = `http://localhost:5000/uploads/${data.pic}`;

      showPicView(imageUrl);
      setTimeout(showDefaultView, 5000);
    }
  });
});
