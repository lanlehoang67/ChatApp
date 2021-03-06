const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const http = require('http');
var app = express();
const {Users} = require('./utils/users');
var users = new Users();
var server = http.createServer(app);
var io = socketIO.listen(server);
const Chat = require("../models/ChatSchema");
const connect = require("../dbconnection");
const port = process.env.PORT || 80;
const bodyParser = require("body-parser");
const router = require("../api/messages");
app.use(bodyParser.json());
app.use("/chats/", router);
app.use(express.static(publicPath));
io.on('connection',(socket)=>{
    console.log('new user connected');
    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name)|| !isRealString(params.room) ){
          return  callback('name and room name are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('admin','welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name} has joined`));
       
        callback();
    });
    socket.on('createMessage',(message,callback)=>{
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
        io.to(user.room).emit('newMessage',generateMessage(user.name,message.text)); 
        connect.then(db => {
            console.log("connected to db");
            let chatMessage = new Chat({ message: message.text, sender: user.name, room: user.room});
            chatMessage.save();
        })
        }
        callback();
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
    });
    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
        }
    })
})
server.listen(80,'0.0.0.0', ()=>{
    console.log(`started on port 80`);
});