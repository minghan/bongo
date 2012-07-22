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

var handleCount = 1;
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

function Trip(tripID, city)
{
  this.tripID = tripID;
  this.city = city;
  this.users = {};
  // this.channel = [];
}

Trip.prototype = {
  addUser: function(connID, socketf) {
    this.users[connID] = new User(connID, socketf);
    console.log("adding conn " + connID + " to " + this.tripID);
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
  }

};

