
/*
 * test home page.
 */

exports.user = function(req, res){
  // res.render('test', { title: 'Foobar' });
  res.send('user ' + req.params.id);
};
