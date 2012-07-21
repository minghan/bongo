
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

xports.foobar = function(req, res){
  res.render('foobar', { title: 'Foobar' });
};
