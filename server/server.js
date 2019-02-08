const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const http = require('http');
var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
io.on('connection',(socket)=>{
    console.log('new user connected');
    socket.emit('newMessage',generateMessage('admin','welcome to the chat app'));
    socket.broadcast.emit('newMessage',generateMessage('admin','new user joined'));
    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text)); 
        callback();
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('admin',coords.latitude,coords.longitude));
    })
    socket.on('disconnect',()=>{
        console.log('user was disconnected');
    })
})
server.listen(port,()=>{
    console.log(`started on port ${port}`);
});