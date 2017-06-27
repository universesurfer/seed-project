var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  let email = req.body.email;
  let user = new User({
    firstName: 'Nick',
    lastName: 'Rodman',
    password: 'super-secret',
    email: email,
  });

  user.save();
  res.redirect('/');
});

module.exports = router;
