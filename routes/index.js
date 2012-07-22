
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Bongo: Collaborative Trip Planning' });
};

exports.invite_friends = function(req, res) {

  // processing here
  res.render('invite_friends', { title: 'Bongo' });
}
