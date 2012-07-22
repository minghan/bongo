
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
  console.log('sessionID: ' + req.sessionID);
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
  var url = req.originalUrl;
  var tid = url.split('/');
  var ind = tid.length - 1;
  if (tid[ind] == '') ind--;
  var tid = tid[ind];
  var trip = globals.trips.getTrip(tid);
  var city = (trip === undefined) ? "Not Found" : trip.city;
  console.log("parsed: " + city);
  res.render('trips', {city: city});
}

exports.getPlaces = function(req, res) {
  var constants = require("../configs/constants");
  var request = require('request');
  var query = req.params.query;
  var city = req.params.city;

  /* Yelp */
  // var yelp_data = constants.yelp;
  // var yelpSearch = yelp_data.searchAPI;

  // var yelp = require("yelp").createClient({
  //   consumer_key: yelp_data.consumer_key, 
  //   consumer_secret: yelp_data.consumer_secret, 
  //   token: yelp_data.token, 
  //   token_secret: yelp_data.token_secret 
  // });

  // yelp.search({ term: "", location: city}, function(err, data) {
  //   var list = [];
  //   var items = data.businesses;
  //   for (var i=0; i<items.length; i++) {
  //     if(items[i].name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
  //       list.push(items[i].name);
  //     }
  //   }
  //   res.send(list);
  // });

  /* foursquare */
  var foursquare = constants.foursquare;
  var fsAPI = foursquare.venueAPI;
  var token = foursquare.access_token;
  var url = fsAPI+"near="+city+"&oauth_token="+token+"&limit="+50;

  request(url, function(err, resp, body) {
    try {
      var body = JSON.parse(body);
      if (body.response.groups.length <= 0) {
        res.send([]);
      }
      var items = body.response.groups[0].items;
      var list = [];
      for (var i=0; i<items.length; i++) {
        if(items[i].venue.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
          list.push(items[i].venue.name);
        }
      }
      res.send(list);
    } catch(err) {
      res.send([]);
    }
  });

  /* Yahoo */
  // var yahooKey = "9FONKRTV34F_.ZXWN8iEjXpP2J3ePxGqIlZQXKcbGd5y4c8G0W.1QYydJmCbUnSOOYdJ8g7zSA--"
}

exports.recommendation = function(req, res) {
  var constants = require("../configs/constants");
  var request = require('request');
  var limit = 20;
  var city = req.params.city;

  /* foursquare */
  var foursquare = constants.foursquare;
  var fsAPI = foursquare.venueAPI;
  var token = foursquare.access_token;
  var url = fsAPI+"near="+city+"&oauth_token="+token+"&limit="+50;
  
  request(url, function(err, resp, body) {
    var body = JSON.parse(body);
    var items = body.response.groups[0].items;
    var list = [];
    for (var i=0; i<items.length; i++) {
      if(i < limit) {
        list.push(items[i].name);
      }
    }
    // res.send(list);
    res.send(url);
  });
}

exports.getData = function(req, res) {
  var constants = require("../configs/constants");
  var request = require('request');
  var name = req.params.name;
  var city = req.params.city;

  /* foursquare */
  var foursquare = constants.foursquare;
  var fsAPI = foursquare.venueAPI;
  var token = foursquare.access_token;
  var url = fsAPI+"near="+city+"&oauth_token="+token+"&limit="+50;
  
  var instagram = constants.instagram;
  var instagramAPI = instagram.geoAPI;
  var instagram_token = instagram.access_token;

  request(url, function(err, resp, body) {
    var obj = {
      "foursquare" : null,
      "instagram" : null
    };
    var body = JSON.parse(body);
    var items = body.response.groups[0].items;
    for (var i=0; i< items.length; i++) {
      if(items[i].venue.name == name) {
        obj["foursquare"] = items[i];
        var lat = items[i].venue.location.lat;
        var lng = items[i].venue.location.lng;
        var instagram_url = instagramAPI+"lat="+lat+"&lng="+lng+"&access_token="+instagram_token;

        request(instagram_url, function(err, resp, body) {
          var body = JSON.parse(body);
          obj["instagram"] = body;
          res.send(obj);
        });
        break;
      }
    }
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
