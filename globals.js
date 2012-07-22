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

/*
module.exports.trips = {
  trips = []

  each trip:
    tripid
    channel
    active_users = {
     session ids:[ ]
       each session id:
        - sess id
        - handle
    }
}
*/
