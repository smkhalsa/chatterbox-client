// YOUR CODE HERE:
var requestTime = '2014-05-25T23:19:10.140Z';
var roomOptions = {};
var updateRooms = function(room){
  if(!roomOptions[room]) {
    roomOptions[room] = true;
    $('#roomSelect').append('<option class="roomItem" data="' + room +'">' + room + '</option>');
  }
};
var data = function(){
  $.ajax({
    url:'https://api.parse.com/1/classes/chatterbox',
    context: document.body
  }).done(function(data){
    for(var i = 0; i < data.results.length; i++) {
      if(data.results[i].text && data.results[i].username && new Date(data.results[i].createdAt) > new Date(requestTime)
        && data.results[i].roomname) {
        updateRooms(data.results[i].roomname);
        var user = data.results[i].username.toString().replace(/<.*?>/, "");
        var message = data.results[i].text.toString().replace(/<.*?>/, "");
        var room = data.results[i].roomname.toString().replace(/<.*?>/, "");

        $('#messages').prepend('<div class="'+room+'">' +'User: ' + user +
        ' Message: '+ message + ' Room: ' + room + '</div>');
      }
    }
    requestTime = data.results[0].createdAt;
  });
};

// data();
setInterval(data, 1000);

$(document).ready(function(){
  $('#submitButton').click(function(){
    // debugger;
    var roomAssignment = $('#roomSelect').val();
    if(roomAssignment === 'New Room') {
      roomAssignment = prompt('Create a new room');
    }
    var message = {
      'username': name,
      'text': $('#messageInput').val(),
      'roomname': roomAssignment
    };
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  });

  $('#roomSelect').on('change', function(){
    // $('#messages').hide();
    // $('.' + $('#roomSelect').val()).show();
    var selection = '.' + $('#roomSelect').val();
    // debugger;
    $('#messages').children().not(selection).hide();
  });

});
