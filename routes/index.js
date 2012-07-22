
/*
 * GET home page.
 */


var globals = require('../globals');

function city_hash(city) { 
  var rnum;
  while (true) {
    rnum = Math.floor((Math.random() * 10000)+1);
    var ret = globals.all.randId.indexOf(rnum);
    if (ret < 0) {
      globals.all.randId.push(rnum);
      break;
    }
  }

  city = city.toLowerCase().replace(/ /gi, '').replace(/,/gi, '');
  city = city + rnum.toString();
  return city;
}

exports.index = function(req, res) {
  var city = req.param('city', 'San Francisco, CA');
  var hash = city_hash(city);
  console.log('hash: ' + hash);
  console.log(req.sessionID);
  res.render('index', { title: 'Bongo: Collaborative Trip Planning' });
};


exports.invite_friends = function(req, res) {
  res.render('invite_friends', { title: 'Bongo' });
}

exports.invite_process = function(req, res){
  var emailServer = globals.emailServer;

  var emails = ["tehminghan@gmail.com"];
  for (i in emails) {
    var email = emails[i];
    var message = {
      text: 'Hi, Someone has invited you to collaborate on a trip. Visit http://trybongo.com/trip/ to get started.',
      from: 'donotreply@trybongo.com',
      to:   email,
      subject: 'Invitation to collaborate on a trip'
    };

    // emailServer.send(message, function(err, message){console.log(err || message)});

    
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
