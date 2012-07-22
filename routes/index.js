
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

*/
exports.getPlaces = function(req, res) {
  var constants = require("../configs/constants");
  var request = require('request');
  var query = req.params.query

  /* foursquare */
  var foursquare = constants.foursquare;
  var city = "Sunnyvale,CA";
  var fsAPI = foursquare.venueAPI;
  var token = foursquare.access_token;
  var url = fsAPI+"near="+city+"&oauth_token="+token;

  request(url, function(err, resp, body) {
    var body = JSON.parse(body);
    var items = body.response.groups[0].items;
    // res.send({"status" : "OK"});
    var list = [];
    for (var i=0; i<items.length; i++) {
        // list.push(items[i].name);
      if(items[i].name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        list.push(items[i].name);
      }
    }
    res.send(list);
    // res.send(query);
  });
}

exports.getIter = function(req, res) {
  var Iter = require('../models/iter');
  var constants = require("../configs/constants");
  var request = require('request');


  /* Yelp */
  var yelp_data = constants.yelp;
  var yelpSearch = yelp_data.searchAPI;

  var yelp = require("yelp").createClient({
    consumer_key: yelp_data.consumer_key, 
    consumer_secret: yelp_data.consumer_secret, 
    token: yelp_data.token, 
    token_secret: yelp_data.token_secret 
  });

  // yelp.search({ term: "food", location: "Sunnyvale, CA"}, function(err, data) {
  //   var first = {
  //   consumer_key: yelp_data.consumer_key, 
  //   consumer_secret: yelp_data.consumer_secret, 
  //   token: yelp_data.token, 
  //   token_secret: yelp_data.token_secret 
  //   }
  //   res.render('foobar', { 
  //         // title : JSON.stringify(first)
  //         title : JSON.stringify(data)
  //       });

  // });
  
  /* Instagram */
  var instagram = constants.instagram;
  var lat = 37.372613;
  var lng = -122.0265469;
  var instagramAPI = instagram.geoAPI;
  var instagram_token = instagram.access_token;
  var instagram_url = instagramAPI+"lat="+lat+"&lng="+lng+"&access_token="+instagram_token;

  request(instagram_url, function(err, resp, body) {
    var body = JSON.parse(body);
    // var first = body.response.groups[0].items[0].name;
    res.render('foobar', { 
          // title : instagram_url
          title : JSON.stringify(body)
          // title : JSON.parse(body);
        });
  });
}
