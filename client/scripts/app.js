// YOUR CODE HERE:
$(document).ready(function(){
  var baseURL = 'http://127.0.0.1:3000/';
  var requestTime = '2014-05-25T23:19:10.140Z';
  var roomOptions = {};
  var currentRoom = 'all';
  var friends = {};
  var name = prompt('What is your name?') || 'anonymous';


  var getMessages = function(){
    $.ajax({
      url: baseURL + (currentRoom === "all" ? 'messages' : 'rooms/' + currentRoom),
      type: 'GET',
      context: document.body
    }).done(function(results){
      var data = JSON.parse(results);
      updateRooms(currentRoom);
      renderMessages(data);
      updateFriends();
    });
  };

  setInterval(getMessages, 1000);

  var renderMessages = function(data) {
    $('#messages').empty();
    for(var i = 0; i < data.results.length; i++) {
      var user = _.escape(data.results[i].username.toString());
      var message = _.escape(data.results[i].text.toString());
      $('#messages').prepend('<div class="all">' +'<span data="' + user + '">' + user + '</span> ' + message + '</div>');
    }
  };

  var updateRooms = function(room){
    if(!roomOptions[room]) {
      roomOptions[room] = true;
      $('#roomSelect').append('<option class="roomItem" data="' + room +'">' + room + '</option>');
      $('#roomSelect').val(room);
    }
  };

  var updateFriends = function(){
    $('#messages > .all > span').removeClass('bold');
    for(var key in friends) {
      $('#messages > .all > span').filter(function(){
        return $(this).attr('data') === key;
      }).addClass('bold');
    }
  };

  $('#messageForm').on('submit', function(e){
    e.preventDefault();
    var roomAssignment = $('#roomSelect').val();
    var message = {
      'username': name,
      'text': $('#messageInput').val(),
      'roomname': roomAssignment,
      'createdAt': new Date()
    };
    $('#messageInput').val('');
    $.ajax({
      url: 'http://127.0.0.1:3000/rooms/' + currentRoom,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        updateRooms(currentRoom);

      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
    $('#messages').prepend('<div class="all">' +'<span data="' + message.username + '">' + message.username + '</span> ' + message.text + '</div>');
  });


  $('#roomSelect').on('change', function(){
    currentRoom = $('#roomSelect').val();
  });

  $('#newRoom').click(function(e){
    currentRoom = prompt('Create a new room!');
    updateRooms(currentRoom);
  });

  $(document).on('click', 'span', function() {
    var user = $(this).attr('data');
    if(friends[user]) {
      delete friends[user];
    } else {
      friends[user] = true;
    }
    updateFriends();
  });

});
