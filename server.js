#!/usr/bin/env

var express = require('express'),
	app = express(),
	path = require('path'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

var usernames = [];

app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(process.env.PORT || 3000);
console.log('Server running');

// Serve file on request
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  console.log('Socket connected');

  // Add user
  socket.on('new user', function(data, callback){
    if(usernames.indexOf(data) != -1){
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(data);
      console.log(data);
      console.log(usernames);
      updateUsernames();
    }
  });

  // Update user
  function updateUsernames(){
    console.log(usernames);
    io.sockets.emit('usernames', usernames);
  }

  // Send message
  socket.on('send message', function(data){
    io.sockets.emit('new message',{msg: data, user:socket.username});
  });

  // Disconnect
  socket.on('disconnect', function(data){
    if(!socket.username){
      return;
    }

    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
})
