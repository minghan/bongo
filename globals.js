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

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function calcLatLng(lat1, lon1, lat2, lon2)
{
  // http://www.movable-type.co.uk/scripts/latlong.html
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

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

function Place(place, connID, dump)
{
  this.place = place;
  this.dump = dump;
  this.connID = connID;
  this.dt = null;
  // console.log(dump);
  try {
    this.lat = dump.foursquare.venue.location.lat;
    this.lng = dump.foursquare.venue.location.lng;
  } catch (err) {
    this.lat = 0;
    this.lng = 0;
  }

  console.log("latlng");
  console.log(this.lat);
  console.log(this.lng);
}

function Trip(tripID, city, start_date, end_date)
{
  this.tripID = tripID;
  this.city = city;
  this.start_date = start_date;
  this.end_date = end_date;
  this.users = {};
  this.places = [];

  this.placesCounter = 0;
  this.segmentsCount = 0;

  this.registerPlace = function(place, connID, dump) {
    this.placesCounter++;
    this.segmentsCount++;
    var p = new Place(place, connID, dump);
    
    // do the magic calc
    if (this.places.length == 0) {
      this.places.push(p);
      return {inpos: 0, place: p};
    } else {
      
      minz = -1;
      mind = 10000000;
      for (var i=0; i<=this.places.length; i++) {
        var d;
        if (i == 0) {
          var pc = this.places[i];
          d = calcLatLng(p.lat, p.lng, pc.lat, pc.lng);
        } else if (i == this.places.length) {
          var pc = this.places[i-1];
          d = calcLatLng(p.lat, p.lng, pc.lat, pc.lng);
        } else {
          var pc1 = this.places[i-1];
          var pc2 = this.places[i];
          var d1 = calcLatLng(p.lat, p.lng, pc1.lat, pc1.lng);
          var d2 = calcLatLng(p.lat, p.lng, pc2.lat, pc2.lng);
          d = Math.max(d1,d2);
        }
        if (d < mind) {
          mind = d; minz = i;
        }
      }

      this.places.splice(minz, 0, p);
      console.log("inpos: " + minz);
      return {inpos: minz, place: p};
    }
  }
}

Trip.prototype = {
  addUser: function(connID, socketf, data) {
    var theuser = new User(connID, socketf);
    this.users[connID] = theuser;
    console.log("adding conn " + connID + " to " + this.tripID);
    return theuser;
  }
}

module.exports.trips = {

  trips: {},
  
  register: function(tripID, city, start_date, end_date) {
    this.trips[tripID] = new Trip(tripID, city, start_date, end_date);
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

