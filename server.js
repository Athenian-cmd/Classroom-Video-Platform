//Back-end Development

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); //import socket.io to server.js
const { v4: uuidv4 } = require('uuid'); //importing library
const { ExpressPeerServer } = require('peer'); //import peerjs
const peerServer = ExpressPeerServer(server, {
    debug: true
})


//app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    //res.status(200).send("Hello World"); //test case
    //res.render('room');
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        //console.log("Person joined room");

        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message);
        });
    })
})

server.listen(3030); //server is local host, port is 3030


//For Powershell
//Write    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser   to activate nodemon
//Write    Set-ExecutionPolicy Restricted -Scope CurrentUser     to set restrictions back to default

//Ctrl + C to exit nodemon

//Noted Issues:
//Camera does not always turns on
//Program crashes when attempting to add another user to the platform
//Because of the above two, muted or disable video icons are unavailable
//Problem probably lies in the installed socket.io package