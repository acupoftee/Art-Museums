var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var enforce = require('express-sslify');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var favicon = require('serve-favicon');
var root = require('./routes/index');
var ig = require('./routes/ig');
var socket = require('./lib/SocketHelper');
var instagram = require('./lib/Instagram');

var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('listening on ', port);
});

// set up session
app.use(session({
  secret: "secret_key",
  reverse: false,
  saveUninitialized: false
}));

app.set('io', io);
app.set('server', server);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', root);
app.use('/ig', ig);

// catch 404 errors
app.use(function(req, res, next) {
  var error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

instagram.initialize();
socket.initialize(io);

module.exports = app;