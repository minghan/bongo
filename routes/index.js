
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Bongo: Collaborative Trip Planning' });
};

exports.invite_friends = function(req, res) {

  res.render('invite_friends', { title: 'Bongo' });
}

exports.foobar = function(req, res){
  res.render('foobar', { title: 'Foobar' });
};

exports.getIter = function(req, res) {
  var Iter = require('../models/iter');
  var constants = require("../configs/constants");
  var request = require('request');
  var _ = require('underscore');

  var fs = constants.foursquare;


  var city = "Sunnyvale,CA";
  var fsAPI = "https://api.foursquare.com/v2/venues/search?";
  var token = fs.access_token;
  var url = fsAPI+"near="+city+"&oauth_token="+token;

    // res.render('foobar', { 
    //   title : "FOO",
    //   url : url
    //     });

  request(url, function(err, resp, body) {
    var body = JSON.parse(body);
    var first = body.response.groups[0].items[0].name;
    // var first = JSON.stringify();
    // var abc = _.keys(body);
    res.render('foobar', { 
          title : "FOO",
          url : first
        });
  });
}
