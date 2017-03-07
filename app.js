var express = require('express'),
      app = express(),
      http = require('http').Server(app),
      io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));
