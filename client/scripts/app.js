// YOUR CODE HERE:
var requestTime = '2014-05-25T23:19:10.140Z';
var data = function() {
  $.ajax({
    url:'https://api.parse.com/1/classes/chatterbox',
    context: document.body
  }).done(function(data){
    for(var i = 0; i < data.results.length; i++) {
      if(data.results[i].text && data.results[i].username && new Date(data.results[i].createdAt) > new Date(requestTime)) {
        var user = data.results[i].username.toString().replace(/<.*?>/, "");
        var message = data.results[i].text.toString().replace(/<.*?>/, "");

        $('#messages').prepend('<div class="message">' +'User: ' + user +
        ' Message: '+ message + '</div>');
      }
    }
    requestTime = data.results[0].createdAt;
  });
};

// data();
setInterval(data, 1000);

$(document).ready(function(){
  $('#submitButton').click(function(event){
    debugger;
    event.stopDefault();
    var message = {
      'username': name,
      'text': $('#messageInput').val(),
      'roomname': ''
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
  })
});
