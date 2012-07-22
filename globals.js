var constants = require("./configs/constants");

var email = require('emailjs/email');

module.exports.emailServer = email.server.connect({
  user:    constants.mailjet.username,
  password:constants.mailjet.password,
  host:    constants.mailjet.host,
  ssl:     true
});



module.exports.all = {
  'randId': []
};

var handleCount = 0;
function User(connID, socketf)
{
  this.connID = connID;
  this.socketf = socketf;

  handleCount++;
  this.handle = "user" + handleCount.toString();

  this.getHandle = function(){
    return this.handle;
  }

  this.setHandle = function(handle){
    this.handle = handle;
  }
}

function Place(place, connID)
{
  this.place = place;
  this.connID = connID;
  this.dt = null;
}

function Trip(tripID, city)
{
  this.tripID = tripID;
  this.city = city;
  this.users = {};
  this.places = [];

  this.registerPlace = function(place, connID) {
    var p = new Place(place, connID);
    this.places.push(p);
    return p;
  }
}

Trip.prototype = {
  addUser: function(connID, socketf) {
    var theuser = new User(connID, socketf);
    this.users[connID] = theuser;
    console.log("adding conn " + connID + " to " + this.tripID);
    return theuser;
  }
}

module.exports.trips = {

  trips: {},
  
  register: function(tripID, city) {
    this.trips[tripID] = new Trip(tripID, city);
    console.log("registered: " + tripID);
  },

  getTrip: function(tripID) {
    return this.trips[tripID];
  },

  getTripByUrl: function(url) {
    var tid = url.split('/');
    var ind = tid.length - 1;
    if (tid[ind] == '') ind--;
    var tid = tid[ind];
    return this.getTrip(tid);
  }

};

