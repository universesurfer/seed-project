var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Message = require('../models/message');
var User = require('../models/user');

router.get('/', function (req, res, next) {
    Message.find()
    .exec(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
      });
    }
    res.status(201).json({
      message: 'Success',
      obj: result
    });
});
});


//PROTECTING MESSAGE ROUTES UNLESS AUTHENTICATED USER
router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'secret', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        title: 'Not authenticated',
        err: err
      });
    }
    next();
  });
});


router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var message = new Message({
            content: req.body.content,
            user: user
        });
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
});



router.patch('/:id', function (req, res, next) {
  Message.findById(req.params.id, function(err, message) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!message) {
      return res.status(500).json({
        title: "No Message Found!",
        error: {message: 'Message not found'}
      });
    }
    message.content = req.body.content;
      message.save(function(err, result) {
        if (err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        res.status(201).json({
          message: 'Updated message',
          obj: result
        });
      });
    });
});

router.delete('/:id', function (req, res, next) {
  Message.findById(req.params.id, function(err, message) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!message) {
      return res.status(500).json({
        title: "No Message Found!",
        error: {message: 'Message not found'}
      });
    }
      message.remove(function(err, result) {
        if (err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        res.status(201).json({
          message: 'Deleted message',
          obj: result
        });
      });
    });
});


module.exports = router;
