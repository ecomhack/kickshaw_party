var request = require('request');

exports.index = function(req, res) {
  res.render('index');
};

exports.menu = function(req, res) {
  var ingredient = req.body.ingredient;
  res.render('menu', {ingredient: ingredient});
};
