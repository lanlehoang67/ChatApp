var socket = io(); 

function scrollToBottom(){
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}
socket.on('connect',function(){
    console.log('connected to server');
});
socket.on('disconnect',function(){
    console.log('disconnected from server');
});  
socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    // console.log('new message:',message);
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    scrollToBottom();
    // $('#messages').append(li);
});
socket.on('welcome',function(message){
    console.log('admin:',message);
})
socket.on('newUser',function(message){
    console.log('admin:',message);
})
socket.on('newLocationMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href',message.url);
    // li.append(a);
    // $('#messages').append(li);
    scrollToBottom();
})
$('#message-form').on('submit',function(e){
    e.preventDefault();
    var messageBox = $('[name=message]');
    if(messageBox.val()){
    socket.emit('createMessage',{
        from: 'User',
        text: messageBox.val()
    },function(){
        messageBox.val('');
    });
}
})
var locationButton = $('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('geolocation not supported for ur browser');
    }
    locationButton.attr('disabled','disabled').text('sending location...');
    navigator.geolocation.getCurrentPosition(function(postition){
        locationButton.removeAttr('disabled').text('send location');
        socket.emit('createLocationMessage',{
            latitude: postition.coords.latitude,
            longitude: postition.coords.longitude
        })
    },function(){
        locationButton.removeAttr('disabled');
        alert('unable to fetch location').text('send location');
    })
});