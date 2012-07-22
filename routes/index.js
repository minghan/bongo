
/*
 * GET home page.
 */

var email = require('emailjs/email');

var emailServer  = email.server.connect({
  user:    "7f323b09baf2546cc335f51537c7b953", 
  password:"password",
  host:    "in.mailjet.com", 
  ssl:     true
});

exports.index = function(req, res) {
  res.render('index', { title: 'Bongo: Collaborative Trip Planning' });
};

exports.invite_friends = function(req, res) {
  res.render('invite_friends', { title: 'Bongo' });
}

exports.invite_process = function(req, res){
  var emails = ["tehminghan@gmail.com"];
  for (i in emails) {
    var email = emails[i];
    var message = {
      text: 'Hi, Someone has invited you to collaborate on a trip. Visit http://trybongo.com/trip/ to get started.',
      from: 'donotreply@trybongo.com',
      to:   email,
      subject: 'Invitation to collaborate on a trip'
    };

    emailServer.send(message, function(err, message){console.log(err || message)});
  }
}

exports.foobar = function(req, res){
  res.render('foobar', { title: 'Foobar' });
};

exports.getIter = function(req, res) {
  var Iter = require('../models/iter');
  var constants = require("../configs/constants");

  var fs = constants.foursquare;

  res.render('foobar', { 
        // title : "FOO"
        title : fs.access_token
      });
}
