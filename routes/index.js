
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

  var fs = constants.foursquare;

  res.render('foobar', { 
        // title : "FOO"
        title : fs.access_token
      });
}
