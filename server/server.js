const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
io.on('connection',(socket)=>{
    console.log('new user connected');
    socket.on('createMessage',(message)=>{
        console.log('createMessage',message);
        io.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })
    socket.on('disconnect',()=>{
        console.log('user was disconnected');
    })
})
server.listen(port,()=>{
    console.log(`started on port ${port}`);
});