
/**
 * Module dependencies.
 */

var PORT = 3000;

var express = require('express');
var routes = require('./routes');
var http = require('http');
var connect = require('express/node_modules/connect');
var globals = require('./globals');

var constants = require("./configs/constants");

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));

  var MemoryStore = connect.session.MemoryStore;
  app.use(express.cookieParser());
  app.use(express.session({
      secret: constants.session_secret,
      store: new MemoryStore({ reapInterval:  6000000 })
  }));
  // http://stackoverflow.com/questions/4371178/session-only-cookie-for-express-js

  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/process', routes.process);
app.get('/trips/:tripid', routes.trips);
app.get('/getPlaces/:city/:query', routes.getPlaces);
app.get('/recommendation/:city', routes.recommendation);
app.get('/getData/:city/:name', routes.getData);

// app.get('/foobar/', routes.foobar);
// app.get('/user/:id', routes.user);
app.get('/iter/', routes.getIter);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// var clients = {};
io.sockets.on('connection', function (socket) {

  var connID = socket.id;
  var tripID = null;
  var trip = null;
  console.log(connID);
  // clients[socket.id] = socket;

  socket.on('init', function(data) {
    console.log(data.tripID);
    tripID = data.tripID;
  
    // what if tripID not found?
    trip = globals.trips.getTrip(tripID);
    if (trip === undefined) {
      console.log(tripID + " not found");
    } else {

      var current_users = [];
      
      for (var usr in trip.users) {
        current_users.push({
          connID: trip.users[usr].connID,
          handle: trip.users[usr].handle
        });
      }

      var theuser = trip.addUser(connID, socket);
      socket.emit('init_feedback', {
        connID: theuser.connID,
        handle: theuser.handle,
        current_users: current_users
      });
      
      // broadcast
      for (var usr in trip.users) {
        if (trip.users.hasOwnProperty(usr)) {
          trip.users[usr].socketf.emit("pull_add_user", {
            connID: theuser.connID,
            handle: theuser.handle
          });
        }
      }
    }
  });

  socket.on('push_add_place', function(data) {
    if (trip !== undefined) {
    
      var p = trip.registerPlace(data.place, connID);

      // broadcast
      for (var usr in trip.users) {
        if (trip.users.hasOwnProperty(usr)) {
          trip.users[usr].socketf.emit("pull_add_place", p);
        }
      }
    }
  });


  socket.on('push_email_invites', function(data) {
    var emails = data.emails.split(',');
      for (i in emails) {
        var email = emails[i];
        var txt = 'Hi, Someone has invited you to collaborate on a trip. ';
        txt = txt + 'Visit http://trybongo.com/trips/' + tripID + ' to get started. ';
        txt = txt + 'Have fun!';
        var message = {
          text: txt,
          from: 'donotreply@trybongo.com',
          to: email,
          subject: 'Invitation to collaborate on a trip'
        };

        globals.emailServer.send(message, function(err, message) {
          console.log(err || message)
        });
      }
  });

  socket.on('disconnect', function() {
    console.log(connID + " disconnected from " + tripID);
  });

  // socket.on('wtf', function(data) {
    // console.log('wtf');
    // console.log(connID + ' ' + tripID);
  // });

  var send = function(evt, dat) {
    socket.emit(evt, dat);
  };

});

// http://stackoverflow.com/questions/4641053/socket-io-and-session
