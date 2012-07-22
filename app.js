
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var connect = require('connect');

var constants = require("./configs/constants");

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));

  var MemoryStore = require('connect').session.MemoryStore;
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
app.post('/invite_friends', routes.invite_friends);
app.post('/invite_process', routes.invite_process);

app.get('/foobar/', routes.foobar);

app.get('/user/:id', routes.user);

app.get('/iter/', routes.getIter);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
