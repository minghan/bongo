
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
  console.log('sessionID:' + req.sessionID);
  res.render('splash', {});
};

exports.process = function(req, res) {
  var city = req.param('city', 'San Francisco, CA');
  var hash = city_hash(city);
  console.log('hash: ' + hash);
  globals.trips.register(hash, city);
  res.redirect('/trips/' + hash);
}

exports.trips = function(req, res) {
  console.log('sessionID:' + req.sessionID);
  res.render('trips', {});
}

/*
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


exports.getIter = function(req, res) {
  var Iter = require('../models/iter');
  var constants = require("../configs/constants");
  var request = require('request');
  var _ = require('underscore');
  var fs = require('fs');

  var foursquare = constants.foursquare;

  var city = "Sunnyvale,CA";
  var fsAPI = foursquare.venueAPI;
  var token = foursquare.access_token;
  var url = fsAPI+"near="+city+"&oauth_token="+token;

  request(url, function(err, resp, body) {
    var body = JSON.parse(body);
    var first = body.response.groups[0].items[0].name;
    res.render('foobar', { 
          title : "FOO",
          url : first
        });
  });
}

*/
